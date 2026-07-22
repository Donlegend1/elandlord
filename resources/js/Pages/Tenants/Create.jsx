import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TenantsCreate({ properties }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        property_id: properties[0]?.id || '',
        unit_id: '',
        lease_start: new Date().toISOString().split('T')[0],
        lease_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        rent_amount: '',
        security_deposit: '',
        payment_cycle: 'monthly',
        notes: '',
    });

    const selectedProperty = properties.find(p => p.id == data.property_id);
    const vacantUnits = selectedProperty?.units || [];

    const handlePropertyChange = (e) => {
        const propId = e.target.value;
        const prop = properties.find(p => p.id == propId);
        setData({
            ...data,
            property_id: propId,
            unit_id: prop?.units[0]?.id || '',
            rent_amount: prop?.units[0]?.rent_amount || '',
        });
    };

    const handleUnitChange = (e) => {
        const uId = e.target.value;
        const unit = vacantUnits.find(u => u.id == uId);
        setData({
            ...data,
            unit_id: uId,
            rent_amount: unit?.rent_amount || data.rent_amount,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tenants.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Add New Tenant & Create Lease</h2>
                    <p className="text-sm text-slate-500">Assign a tenant to a property unit and establish lease dates and payment terms.</p>
                </div>
            }
        >
            <Head title="Add Tenant" />

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                {/* Tenant Personal Details */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">1. Tenant Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="john@example.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="+1 (555) 123-4567"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Lease Details */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">2. Property Unit & Lease Setup</h3>
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
                                {properties.map(p => (
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
                                {vacantUnits.map(u => (
                                    <option key={u.id} value={u.id}>{u.unit_number} (${Number(u.rent_amount).toLocaleString()}/mo)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lease Start Date</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.lease_start}
                                onChange={e => setData('lease_start', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lease End Date</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.lease_end}
                                onChange={e => setData('lease_end', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Agreed Monthly Rent ($)</label>
                            <input
                                type="number"
                                className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.rent_amount}
                                onChange={e => setData('rent_amount', e.target.value)}
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
                                onChange={e => setData('security_deposit', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
                    >
                        {processing ? 'Adding Tenant...' : 'Save Tenant & Activate Lease'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
