import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PropertiesShow({ property, assistants }) {
    const user = usePage().props.auth.user;
    const [showAssignModal, setShowAssignModal] = useState(false);

    const initialAssignedIds = property.assigned_users?.map(u => u.id) || [];
    const { data, setData, post, processing } = useForm({
        assistant_ids: initialAssignedIds,
    });

    const toggleAssistant = (id) => {
        if (data.assistant_ids.includes(id)) {
            setData('assistant_ids', data.assistant_ids.filter(aId => aId !== id));
        } else {
            setData('assistant_ids', [...data.assistant_ids, id]);
        }
    };

    const handleAssignSubmit = (e) => {
        e.preventDefault();
        post(route('properties.assign-assistant', property.id), {
            onSuccess: () => setShowAssignModal(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded capitalize">
                                {property.type}
                            </span>
                            <span className="text-xs text-slate-400">• Owner: {property.landlord?.name}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{property.name}</h2>
                        <p className="text-xs text-slate-500">📍 {property.address}, {property.city}, {property.state} {property.zip}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {(['super_admin', 'landlord'].includes(user.role)) && (
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition"
                            >
                                👥 Assign Assistants
                            </button>
                        )}
                        <Link
                            href={route('tenants.create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm transition"
                        >
                            + Add Tenant to Unit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={property.name} />

            {/* Property Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Units Table */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Property Units ({property.units?.length || 0})</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-3">Unit #</th>
                                        <th className="py-3 px-3">Specs</th>
                                        <th className="py-3 px-3">Monthly Rent</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-3">Current Tenant</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {property.units?.map((unit) => (
                                        <tr key={unit.id}>
                                            <td className="py-3 px-3 font-bold text-slate-800">{unit.unit_number}</td>
                                            <td className="py-3 px-3 text-xs text-slate-500">{unit.bedrooms} Bed, {unit.bathrooms} Bath</td>
                                            <td className="py-3 px-3 font-bold text-slate-800">${Number(unit.rent_amount).toLocaleString()}</td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                                                    unit.status === 'occupied' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {unit.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-xs">
                                                {unit.active_lease?.tenant ? (
                                                    <Link href={route('tenants.show', unit.active_lease.tenant.id)} className="font-semibold text-indigo-600 hover:underline">
                                                        {unit.active_lease.tenant.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-400">Vacant</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Maintenance Tickets */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Maintenance Tickets</h3>
                        {property.maintenance_requests?.length === 0 ? (
                            <p className="text-slate-400 text-xs py-2">No maintenance requests reported for this property.</p>
                        ) : (
                            <div className="space-y-3">
                                {property.maintenance_requests?.map((req) => (
                                    <div key={req.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">{req.title}</div>
                                            <div className="text-slate-500">Tenant: {req.tenant?.name}</div>
                                        </div>
                                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded capitalize">
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Assigned Assistants Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Assigned Assistants</h3>
                            {(['super_admin', 'landlord'].includes(user.role)) && (
                                <button onClick={() => setShowAssignModal(true)} className="text-xs text-indigo-600 font-bold hover:underline">
                                    Edit
                                </button>
                            )}
                        </div>
                        {property.assigned_users?.length === 0 ? (
                            <p className="text-xs text-slate-400">No assistant currently assigned to this property.</p>
                        ) : (
                            <div className="space-y-3">
                                {property.assigned_users?.map((ast) => (
                                    <div key={ast.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                                            {ast.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-xs">{ast.name}</div>
                                            <div className="text-[10px] text-slate-500">{ast.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assign Assistant Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Assign Assistants to {property.name}</h3>
                        <p className="text-xs text-slate-500 mb-4">Selected assistants will be allowed to view tenants, generate receipts, and manage this property.</p>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            {assistants.length === 0 ? (
                                <p className="text-xs text-slate-400 py-3">No assistant accounts created yet. Create an assistant under "Assistants" menu first.</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {assistants.map(ast => (
                                        <label key={ast.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={data.assistant_ids.includes(ast.id)}
                                                onChange={() => toggleAssistant(ast.id)}
                                            />
                                            <div>
                                                <div className="font-bold text-slate-800 text-xs">{ast.name}</div>
                                                <div className="text-[10px] text-slate-500">{ast.email}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Save Assignments
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
