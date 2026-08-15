import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

export default function PropertiesEdit({ property, countries = [], states: initialStates = [], sizes = [] }) {
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
        image: null,
        units: (property.units || []).map((unit) => ({
            id: unit.id,
            unit_number: unit.unit_number,
            rent_amount: unit.rent_amount,
            deposit_amount: unit.deposit_amount,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            status: unit.status,
            image: null,
            image_url: unit.image_url,
        })),
    });

    const [states, setStates] = useState(initialStates);
    const [loadingStates, setLoadingStates] = useState(false);
    const [imagePreview, setImagePreview] = useState(property.image_url || null);

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

    const addUnitRow = () => {
        setData('units', [
            ...data.units,
            { unit_number: `Unit ${data.units.length + 1}`, rent_amount: '1000', deposit_amount: '1000', bedrooms: 1, bathrooms: 1, status: 'vacant', image: null, image_url: null },
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
            image: form.image instanceof File ? form.image : null,
            units: form.units.map((unit) => ({
                id: unit.id || undefined,
                unit_number: unit.unit_number,
                rent_amount: unit.rent_amount,
                deposit_amount: unit.deposit_amount,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                image: unit.image instanceof File ? unit.image : null,
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
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Photo</label>
                            {(imagePreview || property.image_url) && (
                                <img
                                    src={imagePreview || property.image_url}
                                    alt={property.name}
                                    className="mb-3 h-40 w-full rounded-xl object-cover border border-slate-200"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={(e) => {
                                    const file = e.target.files[0] || null;
                                    setData('image', file);
                                    setImagePreview(file ? URL.createObjectURL(file) : property.image_url);
                                }}
                            />
                            {errors.image && <span className="text-xs text-rose-500">{errors.image}</span>}
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
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-lg transition"
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
                                <div className="flex items-center gap-4">
                                    {unit.image_url && !unit.image && (
                                        <img src={unit.image_url} alt={unit.unit_number} className="h-16 w-20 rounded-lg object-cover border border-slate-200" />
                                    )}
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit photo</label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:font-semibold file:text-indigo-700"
                                            onChange={(e) => updateUnitField(idx, 'image', e.target.files[0] || null)}
                                        />
                                        {unit.image?.name && <p className="text-[11px] text-slate-500 mt-1">{unit.image.name}</p>}
                                    </div>
                                </div>
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
