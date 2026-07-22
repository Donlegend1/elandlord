import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function MaintenanceIndex({ maintenanceRequests, tenantLeases }) {
    const user = usePage().props.auth.user;
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        lease_id: tenantLeases[0]?.id || '',
        title: '',
        description: '',
        priority: 'medium',
    });

    const { patch } = useForm({});

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('maintenance.store'), {
            onSuccess: () => {
                setShowSubmitModal(false);
                reset();
            },
        });
    };

    const handleStatusUpdate = (reqId, newStatus) => {
        patch(route('maintenance.update-status', reqId), {
            data: { status: newStatus },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Maintenance & Service Requests</h2>
                        <p className="text-sm text-slate-500">Report repairs, track resolution progress, and manage maintenance tickets.</p>
                    </div>
                    {user.role === 'tenant' && (
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Submit Repair Request
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Maintenance Requests" />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Maintenance Tickets</h3>
                    <span className="text-xs bg-slate-100 font-semibold px-3 py-1 rounded-full text-slate-600">Total Tickets: {maintenanceRequests.length}</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {maintenanceRequests.length === 0 ? (
                        <p className="text-sm text-slate-400 p-8 text-center">No maintenance tickets submitted.</p>
                    ) : (
                        maintenanceRequests.map((req) => (
                            <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-base">{req.title}</h4>
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                                            req.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                                            req.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {req.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600">{req.description}</p>
                                    <div className="text-[11px] text-slate-400 pt-1">
                                        Property: <strong className="text-slate-700">{req.property?.name} ({req.unit?.unit_number})</strong> • Reported by: <strong>{req.tenant?.name}</strong>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {['super_admin', 'landlord', 'assistant'].includes(user.role) ? (
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                            className="text-xs font-bold rounded-lg border-slate-200"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                            req.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                            req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {req.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal: Submit Repair Request */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Submit Repair Request</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Rental Unit</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    value={data.lease_id}
                                    onChange={e => setData('lease_id', e.target.value)}
                                    required
                                >
                                    {tenantLeases.map(l => (
                                        <option key={l.id} value={l.id}>{l.property?.name} (Unit: {l.unit?.unit_number})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Issue Summary / Title</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    placeholder="e.g. Leaking Faucet in Bathroom"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority Level</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Detailed Description</label>
                                <textarea
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    rows="3"
                                    placeholder="Please describe the issue..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowSubmitModal(false)} className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md">
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
