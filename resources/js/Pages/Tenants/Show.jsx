import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function Detail({ label, value }) {
    return (
        <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
            <div className="text-sm font-medium text-slate-800 mt-0.5">{value || '—'}</div>
        </div>
    );
}

export default function TenantsShow({ tenant, profile, identificationTypes = {}, leases, receipts, hasOtherLandlords }) {
    const idLabel = profile?.identification_type
        ? (identificationTypes[profile.identification_type] || profile.identification_type)
        : null;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                            {tenant.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{tenant.name}</h2>
                            <p className="text-xs text-slate-500">{tenant.email} • Phone: {tenant.phone || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm(`Remove ${tenant.name} from all of your properties? Active leases will end and units will become vacant.`)) {
                                    router.delete(route('tenants.destroy', tenant.id));
                                }
                            }}
                            className="text-sm font-semibold bg-rose-50 text-rose-700 px-4 py-2 rounded-xl hover:bg-rose-100"
                        >
                            Remove tenant
                        </button>
                        <Link
                            href={route('tenants.create')}
                            className="text-sm font-semibold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-100"
                        >
                            + Add another lease for this tenant
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Tenant History - ${tenant.name}`} />

            {hasOtherLandlords && (
                <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                    This tenant also rents from another landlord on E-Landlord. You only see leases for your own properties.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Identity & contact person</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Detail label="ID type" value={idLabel} />
                            <Detail label="ID number" value={profile?.identification_number} />
                            <Detail label="ID expiry" value={profile?.identification_expiry} />
                            <Detail label="Date of birth" value={profile?.date_of_birth} />
                            <Detail label="Nationality" value={profile?.nationality} />
                            <Detail label="Occupation" value={profile?.occupation} />
                            <Detail label="Employer" value={profile?.employer} />
                            <Detail label="Permanent address" value={profile?.permanent_address} />
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">ID document</h4>
                            {profile?.has_identification_document ? (
                                <div className="space-y-3">
                                    {profile.identification_document_is_image && profile.identification_document_url && (
                                        <a href={profile.identification_document_url} target="_blank" rel="noreferrer">
                                            <img
                                                src={profile.identification_document_url}
                                                alt="Tenant identification document"
                                                className="max-h-64 rounded-xl border border-slate-200 object-contain bg-slate-50"
                                            />
                                        </a>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm text-slate-600">{profile.identification_document_name || 'Identification document'}</span>
                                        <a
                                            href={profile.identification_document_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                                        >
                                            View
                                        </a>
                                        <a
                                            href={`${profile.identification_document_url}?download=1`}
                                            className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No ID document has been uploaded yet.</p>
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">Emergency / contact person</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Detail label="Name" value={profile?.emergency_contact_name} />
                                <Detail label="Relationship" value={profile?.emergency_contact_relationship} />
                                <Detail label="Phone" value={profile?.emergency_contact_phone} />
                                <Detail label="Email" value={profile?.emergency_contact_email} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Property rental history</h3>

                        {leases.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4">No lease records registered for this tenant on your properties.</p>
                        ) : (
                            <div className="space-y-4">
                                {leases.map((lease) => (
                                    <div key={lease.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-slate-800 text-base">{lease.property?.name}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                                                    lease.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                                }`}>
                                                    {lease.status} Lease
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Unit: <strong className="text-slate-700">{lease.unit?.unit_number}</strong> • {lease.property?.address}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2">
                                                {lease.lease_start} → {lease.lease_end}
                                                {lease.landlord?.name ? ` • Landlord: ${lease.landlord.name}` : ''}
                                            </div>
                                        </div>
                                        <div className="sm:text-right space-y-2">
                                            <div>
                                                <div className="text-xs text-slate-400 uppercase font-semibold">Rent Rate</div>
                                                <div className="text-lg font-extrabold text-slate-900">${Number(lease.rent_amount).toLocaleString()}/mo</div>
                                            </div>
                                            {lease.status === 'active' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm(`Remove this tenant from ${lease.property?.name || 'this unit'}?`)) {
                                                            router.delete(route('leases.destroy', lease.id), { preserveScroll: true });
                                                        }
                                                    }}
                                                    className="text-xs font-semibold text-rose-600 hover:underline"
                                                >
                                                    Remove from this unit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Issued Digital Receipts</h3>
                        {receipts.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No payment receipts generated yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {receipts.map((r) => (
                                    <div key={r.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">Receipt #{r.receipt_number}</div>
                                            <div className="text-slate-500">{r.period_covered} • ${Number(r.amount).toLocaleString()}</div>
                                        </div>
                                        <Link
                                            href={route('receipts.show', r.id)}
                                            className="bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded hover:bg-indigo-100 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
