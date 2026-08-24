import MainLayout from '@/Layouts/MainLayout';
import PhotoGallery from '@/Components/PhotoGallery';
import Seo from '@/Components/Seo';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

function unitPhotos(unit) {
    if (unit?.image_urls?.length) return unit.image_urls;
    return unit?.image_url ? [unit.image_url] : [];
}

export default function ListingsShow({ property, contact_unlock = {} }) {
    const { flash } = usePage().props;
    const location = [property.address, property.city, property.state, property.country, property.zip].filter(Boolean).join(', ');
    const photos = property.image_urls?.length ? property.image_urls : (property.image_url ? [property.image_url] : []);
    const vacantUnits = property.units || [];
    const [selectedUnit, setSelectedUnit] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const unlockForm = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('listings.inquire', property.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const inquireAboutUnit = (unit) => {
        setData('message', `I'm interested in ${unit.unit_number} at ${property.name}.`);
        setSelectedUnit(null);
        document.getElementById('listing-inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        if (!selectedUnit) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedUnit(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedUnit]);

    return (
        <MainLayout>
            <Seo
                title={property.name}
                description={property.description || `View ${property.name} in ${[property.city, property.state, property.country].filter(Boolean).join(', ')} and contact the listing agent or landlord.`}
                path={`/listings/${property.id}`}
                image={photos[0]}
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
                    <PhotoGallery images={photos} alt={property.name} />

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
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Available</div>
                                <div className="font-bold text-slate-900 mt-0.5">{vacantUnits.length}</div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Type</div>
                                <div className="font-bold text-slate-900 mt-0.5 capitalize">{property.type}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-slate-900">Available units</h2>
                        <p className="text-xs text-slate-500 mt-1">Only vacant units are listed. Open a unit to see photos and the full description.</p>

                        {vacantUnits.length === 0 ? (
                            <p className="mt-6 text-sm text-slate-500 bg-slate-50 rounded-2xl p-5">
                                There are no vacant units at this property right now. Send a message if you would like to be notified.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {vacantUnits.map((unit) => {
                                    const thumbs = unitPhotos(unit);
                                    return (
                                        <div key={unit.id} className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                            {thumbs.length > 0 ? (
                                                <img src={thumbs[0]} alt={unit.unit_number} className="h-24 w-full sm:h-20 sm:w-28 rounded-xl object-cover" />
                                            ) : (
                                                <div className="h-24 w-full sm:h-20 sm:w-28 rounded-xl bg-slate-100" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-slate-900">{unit.unit_number}</h3>
                                                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                                        Vacant
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {unit.bedrooms ?? '—'} bed · {unit.bathrooms ?? '—'} bath · {formatRent(unit.rent_amount)}/mo
                                                </p>
                                                {unit.description ? (
                                                    <p className="text-xs text-slate-500 mt-1 truncate">{unit.description}</p>
                                                ) : null}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUnit(unit)}
                                                className="shrink-0 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                                            >
                                                View details
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-6">
                    {flash?.error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-4">{flash.error}</div>
                    )}

                    {contact_unlock.required ? (
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">Unlock phone contact</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Call and WhatsApp details are hidden until you pay {contact_unlock.fee_label}. You can still send an email inquiry below.
                            </p>
                            <form
                                className="mt-4 space-y-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    unlockForm.post(route('listings.unlock', property.id));
                                }}
                            >
                                <input
                                    type="email"
                                    className="w-full rounded-xl border-slate-200 text-sm"
                                    placeholder="Your email for the receipt"
                                    value={unlockForm.data.email}
                                    onChange={(e) => unlockForm.setData('email', e.target.value)}
                                    required
                                />
                                {unlockForm.errors.email && <p className="text-xs text-rose-500">{unlockForm.errors.email}</p>}
                                <button
                                    type="submit"
                                    disabled={unlockForm.processing || !contact_unlock.paystack_ready}
                                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm py-2.5 rounded-xl transition disabled:opacity-50"
                                >
                                    {unlockForm.processing ? 'Redirecting…' : `Pay ${contact_unlock.fee_label} to view contacts`}
                                </button>
                                {!contact_unlock.paystack_ready && (
                                    <p className="text-[11px] text-amber-700">Payments are temporarily unavailable. Use the email form below.</p>
                                )}
                            </form>
                        </div>
                    ) : (
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
                    )}

                    <div id="listing-inquiry" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        {flash?.success ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl mx-auto mb-3 font-bold">✓</div>
                                <h3 className="font-bold text-slate-900">Message sent</h3>
                                <p className="text-xs text-slate-500 mt-2">{flash.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-3">
                                <h3 className="text-base font-bold text-slate-900">{contact_unlock.required ? 'Send an email inquiry' : 'Send a message'}</h3>
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

            {selectedUnit && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setSelectedUnit(null)}
                >
                    <div
                        className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Vacant unit</div>
                                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedUnit.unit_number}</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    {selectedUnit.bedrooms ?? '—'} bed · {selectedUnit.bathrooms ?? '—'} bath · {formatRent(selectedUnit.rent_amount)}/mo
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedUnit(null)}
                                className="text-slate-400 hover:text-slate-700 text-xl leading-none px-2"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <PhotoGallery
                            key={selectedUnit.id}
                            images={unitPhotos(selectedUnit)}
                            alt={selectedUnit.unit_number}
                        />

                        <div className="mt-5">
                            <h4 className="text-sm font-bold text-slate-900">About this unit</h4>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {selectedUnit.description || 'The owner has not added a written description for this unit yet.'}
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Bedrooms</div>
                                <div className="font-bold text-slate-900 mt-0.5">{selectedUnit.bedrooms ?? '—'}</div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Bathrooms</div>
                                <div className="font-bold text-slate-900 mt-0.5">{selectedUnit.bathrooms ?? '—'}</div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Rent</div>
                                <div className="font-bold text-slate-900 mt-0.5">{formatRent(selectedUnit.rent_amount)}</div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => inquireAboutUnit(selectedUnit)}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
                        >
                            Inquire about this unit
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
