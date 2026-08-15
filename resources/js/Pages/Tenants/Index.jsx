import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function TenantsIndex({ leases }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Tenants & History Directory</h2>
                        <p className="text-sm text-slate-500">Track current & past tenant records, lease details, and property rental history.</p>
                    </div>
                    <Link
                        href={route('tenants.create')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        + Add New Tenant
                    </Link>
                </div>
            }
        >
            <Head title="Tenants & History" />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Tenant Lease Records</h3>
                    <span className="text-xs bg-slate-100 font-semibold px-3 py-1 rounded-full text-slate-600">Total Leases: {leases.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                                <th className="py-3.5 px-6">Tenant Name</th>
                                <th className="py-3.5 px-6">Property & Unit</th>
                                <th className="py-3.5 px-6">Monthly Rent</th>
                                <th className="py-3.5 px-6">Lease Period</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leases.map((lease) => (
                                <tr key={lease.id} className="hover:bg-slate-50/60 transition">
                                    <td className="py-4 px-6 font-bold text-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                                                {lease.tenant?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div>{lease.tenant?.name}</div>
                                                <div className="text-xs font-normal text-slate-400">{lease.tenant?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-700">
                                        <div className="font-semibold">{lease.property?.name}</div>
                                        <div className="text-xs text-slate-500">Unit: {lease.unit?.unit_number}</div>
                                    </td>
                                    <td className="py-4 px-6 font-extrabold text-slate-900">
                                        ${Number(lease.rent_amount).toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6 text-xs text-slate-500">
                                        <div>{lease.lease_start} to</div>
                                        <div className="font-semibold text-slate-700">{lease.lease_end}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                                            lease.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {lease.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('tenants.show', lease.tenant_user_id)}
                                                className="inline-block bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                                            >
                                                View
                                            </Link>
                                            {lease.status === 'active' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm(`Remove ${lease.tenant?.name || 'this tenant'} from ${lease.property?.name || 'this property'}?`)) {
                                                            router.delete(route('leases.destroy', lease.id));
                                                        }
                                                    }}
                                                    className="inline-block bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
