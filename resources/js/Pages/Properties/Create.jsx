import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PropertiesCreate({ assistants, countries = [], sizes = [] }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        address: '',
        city: '',
        country_id: '',
        state_id: '',
        zip: '',
        type: 'residential',
        size: '2_bedroom',
        description: '',
        image: null,
        units: [
            { unit_number: 'Apt 1A', rent_amount: '1500', deposit_amount: '1500', bedrooms: 2, bathrooms: 1, image: null }
        ],
        assistant_ids: [],
    });

    const [states, setStates] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);

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
            { unit_number: `Unit ${data.units.length + 1}`, rent_amount: '1000', deposit_amount: '1000', bedrooms: 1, bathrooms: 1, image: null }
        ]);
    };

    const removeUnitRow = (index) => {
        if (data.units.length === 1) return;
        const newUnits = data.units.filter((_, i) => i !== index);
        setData('units', newUnits);
    };

    const updateUnitField = (index, field, value) => {
        const newUnits = [...data.units];
        newUnits[index][field] = value;
        setData('units', newUnits);
    };

    const toggleAssistant = (id) => {
        if (data.assistant_ids.includes(id)) {
            setData('assistant_ids', data.assistant_ids.filter(aId => aId !== id));
        } else {
            setData('assistant_ids', [...data.assistant_ids, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((form) => ({
            ...form,
            image: form.image instanceof File ? form.image : null,
            units: form.units.map((unit) => ({
                unit_number: unit.unit_number,
                rent_amount: unit.rent_amount,
                deposit_amount: unit.deposit_amount,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                image: unit.image instanceof File ? unit.image : null,
            })),
        }));
        post(route('properties.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Register New Property</h2>
                    <p className="text-sm text-slate-500">Fill in details to add a property, specify units, and assign managing assistants.</p>
                </div>
            }
        >
            <Head title="Register Property" />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                {/* Property Basics */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">1. Property Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Name / Title</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="e.g. Sunset Heights Apartments"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Type</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
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
                                onChange={e => setData('size', e.target.value)}
                                required
                            >
                                {(sizes.length ? sizes : [
                                    { value: 'studio', label: 'Studio' },
                                    { value: '1_bedroom', label: '1 Bedroom' },
                                    { value: '2_bedroom', label: '2 Bedrooms' },
                                    { value: '3_bedroom', label: '3 Bedrooms' },
                                    { value: '4_bedroom', label: '4 Bedrooms' },
                                    { value: '5_plus', label: '5+ Bedrooms' },
                                ]).map((size) => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                            {errors.size && <span className="text-xs text-rose-500">{errors.size}</span>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Street Address</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="e.g. 123 Main Street"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Country</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.country_id}
                                onChange={e => handleCountryChange(e.target.value)}
                                required
                            >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.country_id && <span className="text-xs text-rose-500">{errors.country_id}</span>}
                            {countries.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">No countries found. Import your countries table, then reload this page.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">State / Province</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                                value={data.state_id}
                                onChange={e => setData('state_id', e.target.value)}
                                disabled={!data.country_id || loadingStates}
                                required
                            >
                                <option value="">
                                    {!data.country_id
                                        ? 'Select a country first'
                                        : loadingStates
                                            ? 'Loading…'
                                            : states.length === 0
                                                ? 'No states found for this country'
                                                : 'Select state / province'}
                                </option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            {errors.state_id && <span className="text-xs text-rose-500">{errors.state_id}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">City</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Springfield"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                required
                            />
                            {errors.city && <span className="text-xs text-rose-500">{errors.city}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ZIP / Postal Code</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Optional"
                                value={data.zip}
                                onChange={e => setData('zip', e.target.value)}
                            />
                            {errors.zip && <span className="text-xs text-rose-500">{errors.zip}</span>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Photo</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={e => setData('image', e.target.files[0] || null)}
                            />
                            {data.image && <p className="text-xs text-slate-500 mt-1">{data.image.name}</p>}
                            {errors.image && <span className="text-xs text-rose-500">{errors.image}</span>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Property Description</label>
                            <textarea
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="3"
                                placeholder="Amenities, security features, parking details..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Property Units */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">2. Units & Rent Setup</h3>
                            <p className="text-xs text-slate-500">Define apartments/rooms in this property.</p>
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
                            <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Unit # / Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                        value={unit.unit_number}
                                        onChange={e => updateUnitField(idx, 'unit_number', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Monthly Rent ($)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                        value={unit.rent_amount}
                                        onChange={e => updateUnitField(idx, 'rent_amount', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Bedrooms</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                        value={unit.bedrooms}
                                        onChange={e => updateUnitField(idx, 'bedrooms', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Bathrooms</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border-slate-200 text-xs mt-1"
                                        value={unit.bathrooms}
                                        onChange={e => updateUnitField(idx, 'bathrooms', e.target.value)}
                                    />
                                </div>
                                <div className="text-right">
                                    {data.units.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeUnitRow(idx)}
                                            className="text-xs text-rose-600 hover:underline font-semibold"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit photo</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:font-semibold file:text-indigo-700"
                                        onChange={e => updateUnitField(idx, 'image', e.target.files[0] || null)}
                                    />
                                    {unit.image?.name && <p className="text-[11px] text-slate-500 mt-1">{unit.image.name}</p>}
                                    {errors[`units.${idx}.image`] && <span className="text-xs text-rose-500">{errors[`units.${idx}.image`]}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assistant Assignment */}
                {assistants && assistants.length > 0 && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">3. Assign Managing Assistants</h3>
                        <p className="text-xs text-slate-500">Check assistants who can manage tenants and issue receipts for this property.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {assistants.map(ast => (
                                <label key={ast.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={data.assistant_ids.includes(ast.id)}
                                        onChange={() => toggleAssistant(ast.id)}
                                    />
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{ast.name}</div>
                                        <div className="text-xs text-slate-500">{ast.email}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
                    >
                        {processing ? 'Registering Property...' : 'Save & Register Property'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
