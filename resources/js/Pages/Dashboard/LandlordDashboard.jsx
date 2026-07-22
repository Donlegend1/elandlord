import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LandlordDashboard({ stats, properties, recentReceipts, upcomingRenewals, assistants }) {
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

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                        🏢
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Properties</div>
                        <div className="text-2xl font-extrabold text-slate-800">{stats.totalProperties} ({stats.totalUnits} Units)</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                        👥
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenants</div>
                        <div className="text-2xl font-extrabold text-slate-800">{stats.activeTenants}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                        ⏰
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Renewals</div>
                        <div className="text-2xl font-extrabold text-amber-600">{stats.upcomingRenewals}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                        💳
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Month's Revenue</div>
                        <div className="text-2xl font-extrabold text-slate-800">${Number(stats.monthlyRevenue || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Properties List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
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
                            <div className="space-y-4">
                                {properties.slice(0, 3).map((prop) => (
                                    <div key={prop.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{prop.name}</span>
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize font-medium">{prop.type}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{prop.address}, {prop.city}</div>
                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                                <span>🏢 {prop.units?.length || 0} Units</span>
                                                <span>•</span>
                                                <span>👨‍💼 Assistants assigned: {prop.assignments?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={route('properties.show', prop.id)} className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                                                Manage & Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Payment Receipts */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
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
                                    <div key={rec.id} className="py-3 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{rec.tenant?.name}</div>
                                            <div className="text-xs text-slate-500">{rec.property?.name} ({rec.unit?.unit_number}) • {rec.period_covered}</div>
                                        </div>
                                        <div className="text-right">
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

                {/* Right Sidebar Widget */}
                <div className="space-y-6">
                    {/* Assistant Management Card */}
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
                                {assistants.slice(0, 3).map(ast => (
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

                    {/* Upcoming Renewals Alert Widget */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
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
