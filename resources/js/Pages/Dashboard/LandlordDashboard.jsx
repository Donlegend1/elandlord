import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function StatCard({ label, value, accent, icon }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
                <div className="text-2xl font-extrabold text-slate-800 truncate">{value}</div>
            </div>
        </div>
    );
}

export default function LandlordDashboard({ stats, properties, recentReceipts, upcomingRenewals, assistants }) {
    const billing = usePage().props.billing;
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Landlord Control Center</h2>
                        <p className="text-sm text-slate-500">Manage properties, tenants, digital receipts, and property assistants.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={route('properties.create')}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Register Property
                        </Link>
                        <Link
                            href={route('tenants.create')}
                            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Add Tenant
                        </Link>
                        <Link
                            href={route('assistants.index')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Manage Assistants
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Landlord Dashboard" />

            {billing && billing.limit !== null && (
                <div className={'mb-6 rounded-2xl p-4 text-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ' + (billing.can_add ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-900')}>
                    <span>
                        Unit plan: {billing.used} / {billing.limit} used
                        {billing.subscribed ? ' · Subscribed' : ''}
                    </span>
                    {!billing.subscribed && (
                        <Link href={route('billing.index')} className="font-bold underline">
                            {billing.can_add ? 'View plans' : 'Subscribe to add more units'}
                        </Link>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <StatCard
                    label="Properties"
                    value={`${stats.totalProperties} (${stats.totalUnits} Units)`}
                    accent="bg-blue-50 text-blue-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.5A2.25 2.25 0 006.75 21.75h10.5A2.25 2.25 0 0019.5 19.5V9.75" /></svg>}
                />
                <StatCard
                    label="Active Tenants"
                    value={stats.activeTenants}
                    accent="bg-emerald-50 text-emerald-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                />
                <StatCard
                    label="Upcoming Renewals"
                    value={stats.upcomingRenewals}
                    accent="bg-amber-50 text-amber-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    label="This Month's Revenue"
                    value={`$${Number(stats.monthlyRevenue || 0).toLocaleString()}`}
                    accent="bg-indigo-50 text-indigo-600"
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Your Registered Properties</h3>
                            <Link href={route('properties.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                                View All ({properties.length}) &rarr;
                            </Link>
                        </div>

                        {properties.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-sm text-slate-500 mb-3">No properties registered yet.</p>
                                <Link href={route('properties.create')} className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-medium">
                                    + Add Your First Property
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {properties.slice(0, 3).map((prop) => (
                                    <div key={prop.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{prop.name}</span>
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize font-medium">{prop.type}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{prop.address}, {prop.city}</div>
                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                                <span>{prop.units?.length || 0} Units</span>
                                                <span>•</span>
                                                <span>Assistants assigned: {prop.assignments?.length || 0}</span>
                                            </div>
                                        </div>
                                        <Link href={route('properties.show', prop.id)} className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition text-center">
                                            Manage & Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Recent Payment Receipts</h3>
                            <Link href={route('receipts.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                                View Receipts &rarr;
                            </Link>
                        </div>
                        {recentReceipts.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4">No recent payments recorded.</p>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentReceipts.map((rec) => (
                                    <div key={rec.id} className="py-3 flex items-center justify-between gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{rec.tenant?.name}</div>
                                            <div className="text-xs text-slate-500">{rec.property?.name} ({rec.unit?.unit_number}) • {rec.period_covered}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-slate-900 text-sm">${Number(rec.amount).toLocaleString()}</div>
                                            <Link href={route('receipts.show', rec.id)} className="text-xs text-indigo-600 font-semibold hover:underline">
                                                Receipt #{rec.receipt_number}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-lg">Property Assistants</h4>
                            <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full border border-indigo-400/30 font-medium">
                                {assistants.length} Active
                            </span>
                        </div>
                        <p className="text-xs text-indigo-200 mb-4">
                            Delegate management duties to trusted assistants and restrict their access to specific properties.
                        </p>
                        {assistants.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {assistants.slice(0, 3).map((ast) => (
                                    <div key={ast.id} className="bg-white/10 p-2.5 rounded-xl text-xs flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-white">{ast.name}</div>
                                            <div className="text-[10px] text-indigo-200">{ast.assigned_properties?.length || 0} Properties Managed</div>
                                        </div>
                                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link
                            href={route('assistants.index')}
                            className="block text-center w-full bg-white text-indigo-900 font-bold text-xs py-2.5 rounded-xl hover:bg-indigo-50 transition"
                        >
                            Manage Assistants & Property Access
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-800">Lease Renewal Alerts</h4>
                            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                {upcomingRenewals.length} Action Needed
                            </span>
                        </div>
                        {upcomingRenewals.length === 0 ? (
                            <p className="text-xs text-slate-400 py-3">No leases ending in the next 60 days.</p>
                        ) : (
                            <div className="space-y-3">
                                {upcomingRenewals.map((r) => (
                                    <div key={r.id} className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs">
                                        <div className="font-bold text-slate-800">{r.tenant?.name}</div>
                                        <div className="text-slate-600">{r.property?.name} - {r.unit?.unit_number}</div>
                                        <div className="mt-1 font-semibold text-amber-700">Expires: {r.lease_end}</div>
                                    </div>
                                ))}
                                <Link href={route('renewals.index')} className="block text-center text-xs font-bold text-indigo-600 hover:underline pt-2">
                                    Manage Renewals & Send Alerts &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
