import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import { Link, useForm, usePage } from '@inertiajs/react';

function formatRent(amount) {
    if (amount === null || amount === undefined || amount === '') return 'Ask';
    return `$${Number(amount).toLocaleString()}`;
}

function telHref(phone) {
    return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}

function waHref(phone) {
    const digits = String(phone).replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : null;
}

export default function ListingsShow({ property }) {
    const { flash } = usePage().props;
    const location = [property.address, property.city, property.state, property.country, property.zip].filter(Boolean).join(', ');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('listings.inquire', property.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <MainLayout>
            <Seo
                title={property.name}
                description={property.description || `View ${property.name} in ${[property.city, property.state, property.country].filter(Boolean).join(', ')} and contact the listing agent or landlord.`}
                path={`/listings/${property.id}`}
                image={property.image_url}
            />

            <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link href={route('listings.index')} className="text-xs font-semibold text-indigo-300 hover:text-white">
                        ← Back to listings
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded capitalize">{property.type}</span>
                        <span className="text-xs bg-white/10 text-slate-200 font-semibold px-2.5 py-0.5 rounded">{property.size_label}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold mt-3">{property.name}</h1>
                    <p className="mt-3 text-slate-300 text-sm">📍 {location}</p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-tr from-slate-800 to-indigo-900 h-72 sm:h-96">
                        {property.image_url ? (
                            <img src={property.image_url} alt={property.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">No photo yet</div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-slate-900">About this property</h2>
                        <p className="mt-3 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                            {property.description || 'The owner has not added a written description yet. Use the unit list and contact details to learn more.'}
                        </p>
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Size</div>
                                <div className="font-bold text-slate-900 mt-0.5">{property.size_label}</div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Units</div>
                                <div className="font-bold text-slate-900 mt-0.5">{property.total_units}</div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Type</div>
                                <div className="font-bold text-slate-900 mt-0.5 capitalize">{property.type}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-slate-900">Units</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        <th className="pb-2 font-semibold">Photo</th>
                                        <th className="pb-2 font-semibold">Unit</th>
                                        <th className="pb-2 font-semibold">Beds</th>
                                        <th className="pb-2 font-semibold">Baths</th>
                                        <th className="pb-2 font-semibold">Rent</th>
                                        <th className="pb-2 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(property.units || []).map((unit) => (
                                        <tr key={unit.id} className="border-b border-slate-50">
                                            <td className="py-3 pr-3">
                                                {unit.image_url ? (
                                                    <img src={unit.image_url} alt={unit.unit_number} className="h-12 w-16 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="h-12 w-16 rounded-lg bg-slate-100" />
                                                )}
                                            </td>
                                            <td className="py-3 font-semibold text-slate-800">{unit.unit_number}</td>
                                            <td className="py-3 text-slate-600">{unit.bedrooms ?? '—'}</td>
                                            <td className="py-3 text-slate-600">{unit.bathrooms ?? '—'}</td>
                                            <td className="py-3 text-slate-800 font-medium">{formatRent(unit.rent_amount)}</td>
                                            <td className="py-3">
                                                <span className={
                                                    'text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ' +
                                                    (unit.status === 'vacant' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')
                                                }>
                                                    {unit.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Contact</h2>
                        <p className="text-xs text-slate-500 mt-1">Call, WhatsApp, or send a message about this listing.</p>

                        {(property.contacts || []).length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">
                                No phone number is published for this listing. Send a message and the owner will reply by email.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {property.contacts.map((contact, idx) => (
                                    <div key={idx} className="border border-slate-200 rounded-2xl p-4">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{contact.role}</div>
                                        <div className="font-bold text-slate-900 mt-0.5">{contact.name}</div>
                                        <div className="text-sm text-slate-600 mt-1">{contact.phone}</div>
                                        <div className="mt-3 flex gap-2">
                                            <a
                                                href={telHref(contact.phone)}
                                                className="flex-1 text-center text-xs font-bold bg-slate-900 text-white py-2 rounded-xl hover:bg-indigo-600 transition"
                                            >
                                                Call
                                            </a>
                                            {waHref(contact.phone) && (
                                                <a
                                                    href={waHref(contact.phone)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex-1 text-center text-xs font-bold bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-500 transition"
                                                >
                                                    WhatsApp
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        {flash?.success ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl mx-auto mb-3 font-bold">✓</div>
                                <h3 className="font-bold text-slate-900">Message sent</h3>
                                <p className="text-xs text-slate-500 mt-2">{flash.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-3">
                                <h3 className="text-base font-bold text-slate-900">Send a message</h3>
                                <div>
                                    <input
                                        className="w-full rounded-xl border-slate-200 text-sm"
                                        placeholder="Your name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border-slate-200 text-sm"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <input
                                        className="w-full rounded-xl border-slate-200 text-sm"
                                        placeholder="Phone (optional)"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        rows="4"
                                        className="w-full rounded-xl border-slate-200 text-sm"
                                        placeholder="I'm interested in this property…"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
                                >
                                    {processing ? 'Sending…' : 'Send inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </aside>
            </section>
        </MainLayout>
    );
}
