import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TenantsShow({ tenant, leases, receipts }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                            {tenant.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{tenant.name}</h2>
                            <p className="text-xs text-slate-500">{tenant.email} • Phone: {tenant.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Tenant History - ${tenant.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Property Leases History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Tenant Property Rental History</h3>

                        {leases.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4">No lease records registered for this tenant.</p>
                        ) : (
                            <div className="space-y-4">
                                {leases.map((lease) => (
                                    <div key={lease.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800 text-base">{lease.property?.name}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                                                    lease.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                                }`}>
                                                    {lease.status} Lease
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Unit Number: <strong className="text-slate-700">{lease.unit?.unit_number}</strong> • Address: {lease.property?.address}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2">
                                                Lease Start: <strong>{lease.lease_start}</strong> | Lease End: <strong>{lease.lease_end}</strong>
                                            </div>
                                        </div>
                                        <div className="sm:text-right">
                                            <div className="text-xs text-slate-400 uppercase font-semibold">Rent Rate</div>
                                            <div className="text-lg font-extrabold text-slate-900">${Number(lease.rent_amount).toLocaleString()}/mo</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Digital Receipts History Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Issued Digital Receipts</h3>
                        {receipts.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No payment receipts generated yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {receipts.map((r) => (
                                    <div key={r.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">Receipt #{r.receipt_number}</div>
                                            <div className="text-slate-500">{r.period_covered} • ${Number(r.amount).toLocaleString()}</div>
                                        </div>
                                        <Link
                                            href={route('receipts.show', r.id)}
                                            className="bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded hover:bg-indigo-100 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
