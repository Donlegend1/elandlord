import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function SuperAdminDashboard({ stats, recentUsers }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Super Admin Control Center</h2>
                    <p className="text-sm text-slate-500">Global system overview, user roles analytics, and platform metrics.</p>
                </div>
            }
        >
            <Head title="Super Admin Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total System Users</div>
                    <div className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalUsers}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Landlords</div>
                    <div className="text-3xl font-extrabold text-blue-600 mt-2">{stats.totalLandlords}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assistants Created</div>
                    <div className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.totalAssistants}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Platform Revenue</div>
                    <div className="text-3xl font-extrabold text-indigo-600 mt-2">${Number(stats.totalRevenue || 0).toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Billing & subscriptions</h3>
                        <p className="text-sm text-slate-500 mt-1">Set the free unit cap, Paystack plans, and the fee to unlock listing phone contacts.</p>
                    </div>
                    <Link
                        href={route('billing.settings')}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
                    >
                        Manage billing
                    </Link>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Public legal pages</h3>
                        <p className="text-sm text-slate-500 mt-1">Edit Terms of Service and Privacy Policy shown on the website and registration form.</p>
                    </div>
                    <Link
                        href={route('legal-pages.index')}
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
                    >
                        Manage legal pages
                    </Link>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Registered Users</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentUsers.map((u) => (
                                <tr key={u.id}>
                                    <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                                    <td className="py-3 px-4">
                                        <span className="text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded capitalize">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
