import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TenantDashboard({ leases, activeLease, activeLeases, receipts, maintenanceRequests }) {
    const currentLeases = (activeLeases && activeLeases.length > 0)
        ? activeLeases
        : (activeLease ? [activeLease] : []);
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tenant Portal</h2>
                        <p className="text-sm text-slate-500">View your active lease, rental history, payment receipts, and maintenance tickets.</p>
                    </div>
                    <Link
                        href={route('maintenance.index')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        + Submit Maintenance Ticket
                    </Link>
                </div>
            }
        >
            <Head title="Tenant Portal" />

            {/* Active Lease Overview */}
            {currentLeases.length > 0 ? (
                <div className="space-y-4 mb-8">
                    {currentLeases.length > 1 && (
                        <p className="text-sm text-slate-500">You have {currentLeases.length} active leases across different properties.</p>
                    )}
                    {currentLeases.map((lease) => (
                <div key={lease.id} className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Active Lease Agreement
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">{lease.property?.name}</h3>
                            <p className="text-indigo-200 text-sm mt-1">{lease.property?.address}, {lease.property?.city} • Unit: <strong className="text-white">{lease.unit?.unit_number}</strong></p>
                            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-indigo-100">
                                <div>Monthly Rent: <strong className="text-white text-base">${Number(lease.rent_amount).toLocaleString()}</strong></div>
                                <div>Lease Start: <strong className="text-white">{lease.lease_start}</strong></div>
                                <div>Lease End: <strong className="text-amber-300 font-bold">{lease.lease_end}</strong></div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 text-center">
                            <div className="text-xs text-indigo-200 uppercase font-semibold">Landlord / Owner</div>
                            <div className="text-base font-bold text-white mt-1">{lease.landlord?.name}</div>
                            <div className="text-xs text-indigo-200 mt-1">{lease.landlord?.email}</div>
                        </div>
                    </div>
                </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 text-center py-10">
                    <p className="text-slate-500 text-sm">You do not have an active lease right now.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Digital Receipts History */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Your Payment Receipts</h3>
                        <Link href={route('receipts.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                            View All &rarr;
                        </Link>
                    </div>
                    {receipts.length === 0 ? (
                        <p className="text-slate-400 text-sm py-4">No receipts recorded yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {receipts.map((r) => (
                                <div key={r.id} className="py-3.5 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">Receipt #{r.receipt_number}</div>
                                        <div className="text-xs text-slate-500">Period: {r.period_covered} • Date: {r.payment_date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-extrabold text-emerald-600 text-sm">${Number(r.amount).toLocaleString()}</div>
                                        <Link
                                            href={route('receipts.show', r.id)}
                                            className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-semibold hover:bg-indigo-100 transition"
                                        >
                                            📄 View / Print Digital Receipt
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Maintenance Requests */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Your Maintenance Tickets</h3>
                        <Link href={route('maintenance.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                            View Status &rarr;
                        </Link>
                    </div>
                    {maintenanceRequests.length === 0 ? (
                        <p className="text-slate-400 text-sm py-4">No maintenance requests submitted.</p>
                    ) : (
                        <div className="space-y-3">
                            {maintenanceRequests.map((req) => (
                                <div key={req.id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{req.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{req.description}</div>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                                        req.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                        req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
