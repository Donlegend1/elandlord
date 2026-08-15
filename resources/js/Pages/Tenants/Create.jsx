import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const emptyProfile = {
    identification_type: '',
    identification_number: '',
    identification_expiry: '',
    date_of_birth: '',
    nationality: '',
    occupation: '',
    employer: '',
    permanent_address: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    emergency_contact_email: '',
};

export default function TenantsCreate({ properties, identificationTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        ...emptyProfile,
        identification_document: null,
        notes: '',
        property_id: properties[0]?.id || '',
        unit_id: '',
        lease_start: new Date().toISOString().split('T')[0],
        lease_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        rent_amount: '',
        security_deposit: '',
        payment_cycle: 'monthly',
    });

    const [lookup, setLookup] = useState(null);
    const [lookingUp, setLookingUp] = useState(false);
    const lookupTimer = useRef(null);

    const selectedProperty = properties.find((p) => p.id == data.property_id);
    const vacantUnits = selectedProperty?.units || [];
    const existingTenant = lookup?.exists && lookup?.available ? lookup.tenant : null;
    const documentPreview = useMemo(() => {
        if (data.identification_document?.type?.startsWith('image/')) {
            return URL.createObjectURL(data.identification_document);
        }
        return null;
    }, [data.identification_document]);

    useEffect(() => {
        return () => clearTimeout(lookupTimer.current);
    }, []);

    useEffect(() => {
        return () => {
            if (documentPreview) {
                URL.revokeObjectURL(documentPreview);
            }
        };
    }, [documentPreview]);

    const applyLookup = async (email) => {
        if (!email || !email.includes('@')) {
            setLookup(null);
            return;
        }

        setLookingUp(true);
        try {
            const response = await fetch(`${route('tenants.lookup')}?email=${encodeURIComponent(email)}`, {
                headers: { Accept: 'application/json' },
            });
            const result = await response.json();
            setLookup(result);

            if (result.exists && result.available && result.tenant) {
                const tenant = result.tenant;
                const fill = (key, value) => {
                    if (value) {
                        setData(key, value);
                    }
                };
                fill('name', tenant.name);
                fill('phone', tenant.phone);
                fill('identification_type', tenant.identification_type);
                fill('identification_number', tenant.identification_number);
                fill('identification_expiry', tenant.identification_expiry);
                fill('date_of_birth', tenant.date_of_birth);
                fill('nationality', tenant.nationality);
                fill('occupation', tenant.occupation);
                fill('employer', tenant.employer);
                fill('permanent_address', tenant.permanent_address);
                fill('emergency_contact_name', tenant.emergency_contact_name);
                fill('emergency_contact_relationship', tenant.emergency_contact_relationship);
                fill('emergency_contact_phone', tenant.emergency_contact_phone);
                fill('emergency_contact_email', tenant.emergency_contact_email);
            }
        } catch {
            setLookup(null);
        } finally {
            setLookingUp(false);
        }
    };

    const handleEmailChange = (email) => {
        setData('email', email);
        clearTimeout(lookupTimer.current);
        lookupTimer.current = setTimeout(() => applyLookup(email), 450);
    };

    const handlePropertyChange = (e) => {
        const propId = e.target.value;
        const prop = properties.find((p) => p.id == propId);
        setData({
            ...data,
            property_id: propId,
            unit_id: prop?.units[0]?.id || '',
            rent_amount: prop?.units[0]?.rent_amount || '',
        });
    };

    const handleUnitChange = (e) => {
        const uId = e.target.value;
        const unit = vacantUnits.find((u) => u.id == uId);
        setData({
            ...data,
            unit_id: uId,
            rent_amount: unit?.rent_amount || data.rent_amount,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tenants.store'), {
            forceFormData: true,
        });
    };

    const fieldLocked = (key) => Boolean(existingTenant?.[key]);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Add Tenant & Create Lease</h2>
                    <p className="text-sm text-slate-500">
                        Enter the tenant email first. If they already rent from another landlord, we reuse their account instead of creating a duplicate.
                    </p>
                </div>
            }
        >
            <Head title="Add Tenant" />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">1. Tenant identity</h3>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="tenant@example.com"
                            value={data.email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            required
                        />
                        {lookingUp && <p className="mt-1 text-xs text-slate-400">Checking for an existing tenant account…</p>}
                        {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                    </div>

                    {lookup?.exists && lookup?.available && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {lookup.message} Name, ID, and contact person stay on the shared profile.
                        </div>
                    )}
                    {lookup?.exists && !lookup?.available && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                            {lookup.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={fieldLocked('name')}
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="+1 (555) 123-4567"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={fieldLocked('phone')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date of Birth</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                disabled={fieldLocked('date_of_birth')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nationality</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Nigerian"
                                value={data.nationality}
                                onChange={(e) => setData('nationality', e.target.value)}
                                disabled={fieldLocked('nationality')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Occupation</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Software engineer"
                                value={data.occupation}
                                onChange={(e) => setData('occupation', e.target.value)}
                                disabled={fieldLocked('occupation')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employer</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Company name"
                                value={data.employer}
                                onChange={(e) => setData('employer', e.target.value)}
                                disabled={fieldLocked('employer')}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Permanent / home address</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Address outside this rental, if any"
                                value={data.permanent_address}
                                onChange={(e) => setData('permanent_address', e.target.value)}
                                disabled={fieldLocked('permanent_address')}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">2. Means of identification</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ID type</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                value={data.identification_type}
                                onChange={(e) => setData('identification_type', e.target.value)}
                                disabled={fieldLocked('identification_type')}
                            >
                                <option value="">Select ID type</option>
                                {Object.entries(identificationTypes || {}).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ID number</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="A12345678"
                                value={data.identification_number}
                                onChange={(e) => setData('identification_number', e.target.value)}
                                disabled={fieldLocked('identification_number')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ID expiry</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                value={data.identification_expiry}
                                onChange={(e) => setData('identification_expiry', e.target.value)}
                                disabled={fieldLocked('identification_expiry')}
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Upload ID document</label>
                            {existingTenant?.has_identification_document ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    An ID document is already on file{existingTenant.identification_document_name ? ` (${existingTenant.identification_document_name})` : ''}. It stays with the shared tenant profile.
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                        className="w-full rounded-xl border border-slate-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                                        onChange={(e) => setData('identification_document', e.target.files?.[0] || null)}
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">JPG, PNG, WEBP, or PDF. Max 5MB. Scan or photo of the ID.</p>
                                    {data.identification_document && (
                                        <p className="mt-2 text-xs font-medium text-indigo-700">
                                            Selected: {data.identification_document.name}
                                        </p>
                                    )}
                                    {documentPreview && (
                                        <img
                                            src={documentPreview}
                                            alt="ID preview"
                                            className="mt-3 max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-50"
                                        />
                                    )}
                                </>
                            )}
                            {errors.identification_document && <p className="mt-1 text-xs text-rose-600">{errors.identification_document}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">3. Contact person</h3>
                    <p className="text-xs text-slate-500 -mt-2">Emergency contact or next of kin we can reach if the tenant is unavailable.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contact name</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Jane Doe"
                                value={data.emergency_contact_name}
                                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                disabled={fieldLocked('emergency_contact_name')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Relationship</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="Spouse, sibling, parent…"
                                value={data.emergency_contact_relationship}
                                onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                disabled={fieldLocked('emergency_contact_relationship')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contact phone</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="+1 (555) 000-0000"
                                value={data.emergency_contact_phone}
                                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                disabled={fieldLocked('emergency_contact_phone')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contact email</label>
                            <input
                                type="email"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-50"
                                placeholder="jane@example.com"
                                value={data.emergency_contact_email}
                                onChange={(e) => setData('emergency_contact_email', e.target.value)}
                                disabled={fieldLocked('emergency_contact_email')}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">4. Property unit & lease</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Property</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.property_id}
                                onChange={handlePropertyChange}
                                required
                            >
                                <option value="">-- Choose Property --</option>
                                {properties.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Vacant Unit</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.unit_id}
                                onChange={handleUnitChange}
                                required
                            >
                                <option value="">-- Choose Unit --</option>
                                {vacantUnits.map((u) => (
                                    <option key={u.id} value={u.id}>{u.unit_number} (${Number(u.rent_amount).toLocaleString()}/mo)</option>
                                ))}
                            </select>
                            {errors.unit_id && <p className="mt-1 text-xs text-rose-600">{errors.unit_id}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lease Start Date</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.lease_start}
                                onChange={(e) => setData('lease_start', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lease End Date</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.lease_end}
                                onChange={(e) => setData('lease_end', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Agreed Monthly Rent ($)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.rent_amount}
                                onChange={(e) => setData('rent_amount', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Security Deposit ($)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="1000"
                                value={data.security_deposit}
                                onChange={(e) => setData('security_deposit', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment cycle</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.payment_cycle}
                                onChange={(e) => setData('payment_cycle', e.target.value)}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lease notes</label>
                            <textarea
                                rows="3"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Any special terms for this lease"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing || (lookup?.exists && !lookup?.available)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition disabled:opacity-60"
                    >
                        {processing
                            ? 'Saving…'
                            : existingTenant
                                ? 'Add Lease to Existing Tenant'
                                : 'Save Tenant & Activate Lease'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
