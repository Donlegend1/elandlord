import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const services = [
    {
        icon: '🏢',
        title: 'Property & Unit Registration',
        desc: 'Register residential, commercial, multi-family, or industrial properties. Add units, set monthly rent amounts, security deposits, and track vacancy status in real-time.',
        tag: 'Property Owner',
    },
    {
        icon: '👥',
        title: 'Assistant Delegation & Scoped Access',
        desc: 'Landlords can create property assistant accounts and assign specific properties to each assistant. Assistants only see assigned units, tenants, and receipts.',
        tag: 'Assistant Portal',
    },
    {
        icon: '📄',
        title: 'Official Digital Receipts',
        desc: 'Record rent payments and automatically generate verifiable digital receipts with unique numbers (#EL-2026-XXXX), formatted for 1-click printing or PDF download.',
        tag: 'Finance & Invoicing',
    },
    {
        icon: '⏰',
        title: 'Lease Renewal Alerts',
        desc: 'Proactive 30-day and 60-day lease expiration warning banners on the dashboard ensure zero lost rent and quick contract extensions.',
        tag: 'Lease Tracking',
    },
    {
        icon: '📂',
        title: 'Tenant Property History',
        desc: 'Full digital timeline of active and past tenant contracts, lease start/end dates, payment logs, and maintenance requests across properties.',
        tag: 'Tenant Records',
    },
    {
        icon: '🔧',
        title: 'Maintenance Request Portal',
        desc: 'Tenants submit repair tickets directly from their portal with priority levels (Low, Medium, High, Urgent), while property managers update resolution status.',
        tag: 'Property Maintenance',
    },
];

export default function Home({ stats, testimonials, faqs }) {
    const [openFaq, setOpenFaq] = useState(null);
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        location: '',
        rating: 5,
        quote: '',
    });

    const handleTestimonialSubmit = (e) => {
        e.preventDefault();
        post(route('testimonials.store'), {
            onSuccess: () => {
                reset();
                setShowTestimonialModal(false);
            },
        });
    };

    return (
        <MainLayout>
            <Head>
                <title>E-Landlord - Digital Property Management System</title>
                <meta name="description" content="E-Landlord is an online app for landlords to manage properties, add tenants, assign assistants, issue digital receipts, and send renewal reminders." />
            </Head>

            {/* ── 1. HERO SECTION ── */}
            <section className="relative min-h-[85vh] flex items-center justify-center -mt-20 overflow-hidden bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
                {/* Subtle Background Glow Elements */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        <span>✨ Online Digital Property Management System</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                        Everything Digital About <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                            Managing Your Properties
                        </span>
                    </h1>

                    <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                        Streamline your rental operations. Register properties and units, add tenants, assign managing assistants with custom property access, issue printable digital receipts, and track lease renewal alerts.
                    </p>

                    <div className="pt-4 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/listings"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl transition hover:scale-105"
                        >
                            Browse Properties
                        </Link>
                        <Link
                            href="/register"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-base px-8 py-4 rounded-2xl border border-slate-700 transition"
                        >
                            Register Landlord Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2. PLATFORM LIVE METRICS ── */}
            <section className="py-12 bg-slate-900 border-y border-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-4">
                                <div className="text-3xl sm:text-4xl font-black text-indigo-400">{stat.value}</div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. CORE SERVICES & FEATURES ── */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            Comprehensive Services
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Designed for Seamless Property Management</h2>
                        <p className="text-slate-600 text-base font-light">
                            E-Landlord replaces paperwork with digital efficiency, giving property owners, assistants, and tenants complete transparency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed font-normal">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. TESTIMONIALS SECTION (REPLACED DEMO ACCOUNTS SECTION) ── */}
            <section className="py-24 bg-slate-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                        <div>
                            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                Verified User Feedback
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">What Landlords & Tenants Say</h2>
                            <p className="text-slate-400 text-sm font-light mt-1">
                                Reviews from property owners, assistants, and tenants who use E-Landlord.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowTestimonialModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition whitespace-nowrap"
                        >
                            + Share Your Testimonial
                        </button>
                    </div>

                    {testimonials && testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t) => (
                                <div key={t.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between hover:border-indigo-500/50 transition shadow-lg">
                                    <div>
                                        <div className="flex items-center gap-1 mb-4 text-amber-400 text-sm">
                                            {[...Array(t.rating || 5)].map((_, i) => (
                                                <span key={i}>★</span>
                                            ))}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{t.name}</div>
                                            <div className="text-xs text-indigo-300 font-medium">{t.location || 'E-Landlord User'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-3xl">
                            <p className="text-slate-400 text-sm">No testimonials displayed yet. Be the first to share your experience!</p>
                            <button
                                onClick={() => setShowTestimonialModal(true)}
                                className="mt-4 text-xs font-bold text-indigo-400 underline hover:text-indigo-300"
                            >
                                + Click here to add a testimonial
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal: Submit Testimonial */}
            {showTestimonialModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white text-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Add Your Testimonial</h3>
                                <p className="text-xs text-slate-500">Your review will be published upon administrator approval.</p>
                            </div>
                            <button onClick={() => setShowTestimonialModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-300 text-sm"
                                    placeholder="e.g. Marcus Vance"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role / Location (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-300 text-sm"
                                    placeholder="e.g. Property Owner, Springfield"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating (1 to 5 Stars)</label>
                                <select
                                    className="w-full rounded-xl border-slate-300 text-sm font-semibold"
                                    value={data.rating}
                                    onChange={e => setData('rating', Number(e.target.value))}
                                >
                                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Review / Quote</label>
                                <textarea
                                    className="w-full rounded-xl border-slate-300 text-sm"
                                    rows="4"
                                    placeholder="Share your experience using E-Landlord..."
                                    value={data.quote}
                                    onChange={e => setData('quote', e.target.value)}
                                    required
                                ></textarea>
                                {errors.quote && <span className="text-xs text-rose-500">{errors.quote}</span>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowTestimonialModal(false)}
                                    className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md"
                                >
                                    {processing ? 'Submitting...' : 'Submit Testimonial'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── 5. FREQUENTLY ASKED QUESTIONS ── */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-3">
                        <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
                        <p className="text-slate-500 text-sm">Everything you need to know about setting up properties and user roles.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-6 text-left font-bold text-slate-900 flex justify-between items-center text-base hover:bg-slate-50 transition"
                                >
                                    <span>{faq.q}</span>
                                    <span className="text-xl text-indigo-600 font-extrabold">{openFaq === idx ? '−' : '+'}</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. CALL TO ACTION ── */}
            <section className="py-20 bg-gradient-to-r from-indigo-900 to-slate-950 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-black">Transform Your Property Management Today</h2>
                    <p className="text-indigo-200 text-base max-w-xl mx-auto font-light">
                        Digitize property registration, tenant history, printable receipts, and renewal reminders with E-Landlord.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/register"
                            className="bg-white hover:bg-indigo-50 text-indigo-950 font-black text-base px-8 py-4 rounded-2xl shadow-xl transition inline-block"
                        >
                            Get Started Free &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
