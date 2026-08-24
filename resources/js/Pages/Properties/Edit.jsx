import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ImagePicker from '@/Components/ImagePicker';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const sizeFallback = [
    { value: 'studio', label: 'Studio' },
    { value: '1_bedroom', label: '1 Bedroom' },
    { value: '2_bedroom', label: '2 Bedrooms' },
    { value: '3_bedroom', label: '3 Bedrooms' },
    { value: '4_bedroom', label: '4 Bedrooms' },
    { value: '5_plus', label: '5+ Bedrooms' },
];

export default function PropertiesEdit({ property, countries = [], states: initialStates = [], sizes = [], quota }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'put',
        name: property.name || '',
        address: property.address || '',
        city: property.city || '',
        country_id: property.country_id || '',
        state_id: property.state_id || '',
        zip: property.zip || '',
        type: property.type || 'residential',
        size: property.size || '2_bedroom',
        description: property.description || '',
        images: [],
        remove_image_ids: [],
        units: (property.units || []).map((unit) => ({
            id: unit.id,
            unit_number: unit.unit_number,
            rent_amount: unit.rent_amount,
            deposit_amount: unit.deposit_amount,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            description: unit.description || '',
            status: unit.status,
            images: [],
            existing_images: (unit.images || []).map((image) => ({ id: image.id, url: image.url })),
            remove_image_ids: [],
        })),
    });

    const [states, setStates] = useState(initialStates);
    const [loadingStates, setLoadingStates] = useState(false);
    const existingPropertyImages = (property.images || []).map((image) => ({ id: image.id, url: image.url }));

    useEffect(() => {
        if (!data.country_id) {
            setStates([]);
            return;
        }

        let cancelled = false;
        setLoadingStates(true);

        axios
            .get(route('locations.states'), { params: { country_id: data.country_id } })
            .then((response) => {
                if (!cancelled) {
                    setStates(response.data.states || []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStates([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingStates(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [data.country_id]);

    const handleCountryChange = (countryId) => {
        setData({
            ...data,
            country_id: countryId,
            state_id: '',
        });
    };

    const existingUnitCount = (property.units || []).length;
    const maxUnits = quota?.limit == null ? null : Math.max(existingUnitCount, quota.limit - (quota.used - existingUnitCount));

    const addUnitRow = () => {
        if (maxUnits != null && data.units.length >= maxUnits) return;
        setData('units', [
            ...data.units,
            { unit_number: `Unit ${data.units.length + 1}`, rent_amount: '1000', deposit_amount: '1000', bedrooms: 1, bathrooms: 1, description: '', status: 'vacant', images: [], existing_images: [], remove_image_ids: [] },
        ]);
    };

    const removeUnitRow = (index) => {
        const unit = data.units[index];
        if (unit.status === 'occupied') return;
        if (data.units.length === 1) return;
        setData('units', data.units.filter((_, i) => i !== index));
    };

    const updateUnitField = (index, field, value) => {
        const newUnits = [...data.units];
        newUnits[index][field] = value;
        setData('units', newUnits);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            images: (form.images || []).filter((file) => file instanceof File),
            remove_image_ids: form.remove_image_ids || [],
            units: form.units.map((unit) => ({
                id: unit.id || undefined,
                unit_number: unit.unit_number,
                rent_amount: unit.rent_amount,
                deposit_amount: unit.deposit_amount,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                description: unit.description,
                images: (unit.images || []).filter((file) => file instanceof File),
                remove_image_ids: unit.remove_image_ids || [],
            })),
        }));
        post(route('properties.update', property.id), { forceFormData: true });
    };

    const sizeOptions = sizes.length ? sizes : sizeFallback;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Update Property</h2>
                    <p className="text-sm text-slate-500">Change details, photos, and units for {property.name}.</p>
                </div>
            }
        >
            <Head title={`Edit ${property.name}`} />

            {quota && quota.limit !== null && (
                <div className="mb-6 rounded-2xl p-4 text-sm border bg-slate-50 border-slate-200 text-slate-700">
                    Free plan: {quota.used} / {quota.limit} units used.
                    {quota.can_add ? ` You can add ${quota.remaining} more.` : <> Subscribe on the <Link href={route('billing.index')} className="font-bold underline">billing page</Link> to add more units.</>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">1. Property Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Name / Title</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Type</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="multi-family">Multi-Family</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Size</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.size}
                                onChange={(e) => setData('size', e.target.value)}
                                required
                            >
                                {sizeOptions.map((size) => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Street Address</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Country</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.country_id}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                required
                            >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                            {errors.country_id && <span className="text-xs text-rose-500">{errors.country_id}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">State / Province</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                value={data.state_id}
                                onChange={(e) => setData('state_id', e.target.value)}
                                disabled={!data.country_id || loadingStates}
                                required
                            >
                                <option value="">{loadingStates ? 'Loading…' : 'Select state / province'}</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            {errors.state_id && <span className="text-xs text-rose-500">{errors.state_id}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">City</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ZIP / Postal Code</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.zip}
                                onChange={(e) => setData('zip', e.target.value)}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <ImagePicker
                                label="Property Photos"
                                files={data.images}
                                onChange={(files) => setData('images', files)}
                                existing={existingPropertyImages.filter((image) => !data.remove_image_ids.includes(image.id))}
                                onRemoveExisting={(id) => setData('remove_image_ids', [...data.remove_image_ids, id])}
                                max={12}
                                error={errors.images || errors['images.0']}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Description</label>
                            <textarea
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">2. Units & Photos</h3>
                            <p className="text-xs text-slate-500">Update unit details and photos. Occupied units cannot be removed.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addUnitRow}
                            disabled={maxUnits != null && data.units.length >= maxUnits}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-lg transition disabled:opacity-40"
                        >
                            + Add Unit
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.units.map((unit, idx) => (
                            <div key={unit.id || `new-${idx}`} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Unit # / Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                            value={unit.unit_number}
                                            onChange={(e) => updateUnitField(idx, 'unit_number', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Monthly Rent ($)</label>
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                            value={unit.rent_amount}
                                            onChange={(e) => updateUnitField(idx, 'rent_amount', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Bedrooms</label>
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                            value={unit.bedrooms}
                                            onChange={(e) => updateUnitField(idx, 'bedrooms', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Bathrooms</label>
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                            value={unit.bathrooms}
                                            onChange={(e) => updateUnitField(idx, 'bathrooms', e.target.value)}
                                        />
                                    </div>
                                    <div className="text-right">
                                        {data.units.length > 1 && unit.status !== 'occupied' && (
                                            <button
                                                type="button"
                                                onClick={() => removeUnitRow(idx)}
                                                className="text-xs text-rose-600 hover:underline font-semibold"
                                            >
                                                Remove
                                            </button>
                                        )}
                                        {unit.status === 'occupied' && (
                                            <span className="text-[10px] font-bold uppercase text-emerald-700">Occupied</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Unit description</label>
                                    <textarea
                                        className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                        rows="2"
                                        placeholder="Layout, finishes, views, and what makes this unit unique…"
                                        value={unit.description || ''}
                                        onChange={(e) => updateUnitField(idx, 'description', e.target.value)}
                                    />
                                </div>
                                <ImagePicker
                                    label="Unit photos"
                                    files={unit.images || []}
                                    onChange={(files) => updateUnitField(idx, 'images', files)}
                                    existing={(unit.existing_images || []).filter((image) => !(unit.remove_image_ids || []).includes(image.id))}
                                    onRemoveExisting={(id) => updateUnitField(idx, 'remove_image_ids', [...(unit.remove_image_ids || []), id])}
                                    max={8}
                                    error={errors[`units.${idx}.images`] || errors[`units.${idx}.images.0`]}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href={route('properties.show', property.id)}
                        className="text-sm font-semibold text-slate-600 px-5 py-3 rounded-xl hover:bg-slate-100"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
                    >
                        {processing ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
