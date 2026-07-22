import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AssistantsIndex({ assistants, properties }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAssistant, setEditingAssistant] = useState(null);

    // Create Form
    const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, reset: resetCreate } = useForm({
        name: '',
        email: '',
        phone: '',
        password: 'password',
        property_ids: [],
    });

    // Assign Form
    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
        property_ids: [],
    });

    const toggleCreateProperty = (propId) => {
        if (createData.property_ids.includes(propId)) {
            setCreateData('property_ids', createData.property_ids.filter(id => id !== propId));
        } else {
            setCreateData('property_ids', [...createData.property_ids, propId]);
        }
    };

    const toggleAssignProperty = (propId) => {
        if (assignData.property_ids.includes(propId)) {
            setAssignData('property_ids', assignData.property_ids.filter(id => id !== propId));
        } else {
            setAssignData('property_ids', [...assignData.property_ids, propId]);
        }
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postCreate(route('assistants.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate();
            },
        });
    };

    const openAssignModal = (ast) => {
        setEditingAssistant(ast);
        const assignedIds = ast.assigned_properties?.map(p => p.id) || [];
        setAssignData('property_ids', assignedIds);
    };

    const handleAssignSubmit = (e) => {
        e.preventDefault();
        postAssign(route('assistants.assign-properties', editingAssistant.id), {
            onSuccess: () => setEditingAssistant(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Property Assistants Management</h2>
                        <p className="text-sm text-slate-500">Create assistant accounts and assign specific properties they can manage.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
                    >
                        + Create Assistant Account
                    </button>
                </div>
            }
        >
            <Head title="Property Assistants" />

            {/* Assistants Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assistants.map((ast) => (
                    <div key={ast.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                                        {ast.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base">{ast.name}</h3>
                                        <p className="text-xs text-slate-500">{ast.email}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{ast.phone || 'No phone set'}</p>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Assistant
                                </span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Assigned Properties ({ast.assigned_properties?.length || 0})
                                </div>
                                {ast.assigned_properties?.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No properties assigned yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {ast.assigned_properties?.map(p => (
                                            <span key={p.id} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                                                🏢 {p.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => openAssignModal(ast)}
                                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs px-3.5 py-2 rounded-lg transition"
                            >
                                ⚙️ Assign / Change Properties
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Create Assistant */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Create Assistant Account</h3>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assistant Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    placeholder="Sarah Assistant"
                                    value={createData.name}
                                    onChange={e => setCreateData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    placeholder="assistant@example.com"
                                    value={createData.email}
                                    onChange={e => setCreateData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    placeholder="+1 (555) 000-0000"
                                    value={createData.phone}
                                    onChange={e => setCreateData('phone', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Login Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    value={createData.password}
                                    onChange={e => setCreateData('password', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Assign Initial Properties</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {properties.map(p => (
                                        <label key={p.id} className="flex items-center gap-3 p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-indigo-600"
                                                checked={createData.property_ids.includes(p.id)}
                                                onChange={() => toggleCreateProperty(p.id)}
                                            />
                                            <div className="text-xs font-semibold text-slate-800">{p.name} ({p.city})</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={createProcessing} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-emerald-700">
                                    {createProcessing ? 'Creating...' : 'Create Assistant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Assigned Properties */}
            {editingAssistant && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Assign Properties to {editingAssistant.name}</h3>
                        <p className="text-xs text-slate-500">Check all properties this assistant is authorized to manage.</p>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {properties.map(p => (
                                    <label key={p.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-indigo-600"
                                            checked={assignData.property_ids.includes(p.id)}
                                            onChange={() => toggleAssignProperty(p.id)}
                                        />
                                        <div className="text-xs font-semibold text-slate-800">{p.name} ({p.city})</div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingAssistant(null)} className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" disabled={assignProcessing} className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700">
                                    Save Property Assignments
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
