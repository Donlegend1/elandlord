import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function PropertiesIndex({ properties }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Property Directory</h2>
                        <p className="text-sm text-slate-500">Register, manage, and assign property managers/assistants.</p>
                    </div>
                    {(['super_admin', 'landlord'].includes(user.role)) && (
                        <Link
                            href={route('properties.create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Register New Property
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Properties" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((prop) => (
                    <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition">
                        <div className="h-44 bg-gradient-to-tr from-slate-800 to-indigo-900 relative p-6 flex flex-col justify-end text-white">
                            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                                {prop.type}
                            </span>
                            <h3 className="text-xl font-extrabold tracking-tight leading-snug">{prop.name}</h3>
                            <p className="text-xs text-slate-300 mt-1">📍 {prop.address}, {prop.city}, {prop.state}</p>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="text-xs text-slate-500 line-clamp-2">
                                    {prop.description || 'No detailed description provided.'}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                                    <div>
                                        <div className="text-slate-400 font-medium">Total Units</div>
                                        <div className="font-bold text-slate-800 text-sm">{prop.units?.length || 0} Units</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 font-medium">Assigned Assistants</div>
                                        <div className="font-bold text-slate-800 text-sm">{prop.assigned_users?.length || 0} Staff</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={route('properties.show', prop.id)}
                                    className="w-full text-center bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs py-2.5 rounded-xl transition"
                                >
                                    Manage Property & Units &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
