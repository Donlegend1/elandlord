import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function RenewalsIndex({ expiring30Days, expiring60Days, expiredLeases, allActiveLeases }) {
    const [selectedLease, setSelectedLease] = useState(null);

    const { data, setData, post, processing } = useForm({
        new_lease_end: '',
        new_rent_amount: '',
    });

    const openRenewModal = (lease) => {
        setSelectedLease(lease);
        const currentEnd = new Date(lease.lease_end);
        const nextYear = new Date(currentEnd.setFullYear(currentEnd.getFullYear() + 1)).toISOString().split('T')[0];
        setData({
            new_lease_end: nextYear,
            new_rent_amount: lease.rent_amount,
        });
    };

    const handleRenewSubmit = (e) => {
        e.preventDefault();
        post(route('renewals.renew', selectedLease.id), {
            onSuccess: () => setSelectedLease(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Lease Renewal Reminders</h2>
                    <p className="text-sm text-slate-500">Track expiring leases, send reminders, and extend active lease contracts.</p>
                </div>
            }
        >
            <Head title="Renewal Reminders" />

            <div className="space-y-8">
                {/* Expiring in 30 Days (Urgent Alert) */}
                <div className="bg-white rounded-2xl border border-rose-200 shadow-xs overflow-hidden">
                    <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-sm">⚠️</span>
                            <div>
                                <h3 className="font-bold text-rose-900 text-lg">Expiring within 30 Days ({expiring30Days.length})</h3>
                                <p className="text-xs text-rose-700">Immediate action required to send renewal notice or update lease status.</p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {expiring30Days.length === 0 ? (
                            <p className="text-xs text-slate-400 p-6">No leases expiring in the next 30 days.</p>
                        ) : (
                            expiring30Days.map((lease) => (
                                <div key={lease.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                                    <div>
                                        <div className="font-bold text-slate-800 text-base">{lease.tenant?.name}</div>
                                        <div className="text-xs text-slate-500">{lease.property?.name} — Unit: {lease.unit?.unit_number}</div>
                                        <div className="text-xs text-rose-600 font-bold mt-1">Lease Ends: {lease.lease_end}</div>
                                    </div>
                                    <button
                                        onClick={() => openRenewModal(lease)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                                    >
                                        🔄 Extend / Renew Lease
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Expiring in 60 Days */}
                <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
                    <div className="p-6 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">⏰</span>
                            <div>
                                <h3 className="font-bold text-amber-900 text-lg">Expiring within 60 Days ({expiring60Days.length})</h3>
                                <p className="text-xs text-amber-700">Upcoming lease expirations for proactive notice.</p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {expiring60Days.length === 0 ? (
                            <p className="text-xs text-slate-400 p-6">No leases expiring in 31–60 days.</p>
                        ) : (
                            expiring60Days.map((lease) => (
                                <div key={lease.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="font-bold text-slate-800 text-base">{lease.tenant?.name}</div>
                                        <div className="text-xs text-slate-500">{lease.property?.name} — Unit: {lease.unit?.unit_number}</div>
                                        <div className="text-xs text-amber-700 font-bold mt-1">Lease Ends: {lease.lease_end}</div>
                                    </div>
                                    <button
                                        onClick={() => openRenewModal(lease)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                                    >
                                        🔄 Extend / Renew Lease
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Renew Lease */}
            {selectedLease && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Renew Lease for {selectedLease.tenant?.name}</h3>
                        <p className="text-xs text-slate-500">Extend the lease end date for {selectedLease.property?.name} ({selectedLease.unit?.unit_number}).</p>

                        <form onSubmit={handleRenewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">New Lease End Date</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500"
                                    value={data.new_lease_end}
                                    onChange={e => setData('new_lease_end', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">New Monthly Rent ($)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500"
                                    value={data.new_rent_amount}
                                    onChange={e => setData('new_rent_amount', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setSelectedLease(null)} className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-indigo-700">
                                    Confirm Renewal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
