import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AssistantDashboard({ stats, activeLeases, recentReceipts, upcomingRenewals }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Assistant Portal</h2>
                        <p className="text-sm text-slate-500">You are managing properties assigned to you by your landlord/owner.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('receipts.index')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Issue Rent Receipt
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Assistant Dashboard" />

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Properties</div>
                    <div className="text-3xl font-extrabold text-slate-800 mt-2">{stats.assignedPropertiesCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenants</div>
                    <div className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.activeTenantsCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Renewals</div>
                    <div className="text-3xl font-extrabold text-amber-600 mt-2">{stats.upcomingRenewalsCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Collected</div>
                    <div className="text-3xl font-extrabold text-indigo-600 mt-2">${Number(stats.totalCollected || 0).toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Tenants List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Tenants in Assigned Properties</h3>
                    {activeLeases.length === 0 ? (
                        <p className="text-slate-400 text-sm py-4">No active tenants in assigned properties.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {activeLeases.map((lease) => (
                                <div key={lease.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{lease.tenant?.name}</div>
                                        <div className="text-xs text-slate-500">{lease.property?.name} ({lease.unit?.unit_number})</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 font-semibold">${Number(lease.rent_amount).toLocaleString()}/mo</div>
                                        <Link href={route('tenants.show', lease.tenant_user_id)} className="text-xs text-indigo-600 hover:underline">
                                            View History
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Receipts Issued */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Receipts Issued</h3>
                    {recentReceipts.length === 0 ? (
                        <p className="text-slate-400 text-sm py-4">No receipts recorded yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentReceipts.map((rec) => (
                                <div key={rec.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{rec.tenant?.name}</div>
                                        <div className="text-xs text-slate-500">{rec.property?.name} • {rec.period_covered}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-600 text-sm">${Number(rec.amount).toLocaleString()}</div>
                                        <Link href={route('receipts.show', rec.id)} className="text-xs text-indigo-600 hover:underline">
                                            #{rec.receipt_number}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
