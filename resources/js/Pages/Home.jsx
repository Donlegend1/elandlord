import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import ProductCard from '@/Components/ProductCard';
import FaqAccordion from '@/Components/FaqAccordion';
import { Link, router, useForm } from '@inertiajs/react';

export default function Home({ products, stats, testimonials, faqs }) {
    const [searchQuery, setSearchQuery] = useState({
        location: '',
        category: '',
        priceRange: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        location: '',
        rating: 5,
        quote: '',
    });

    const handleTestimonialSubmit = (e) => {
        e.preventDefault();
        post('/testimonials', {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
                alert('Thank you! Your testimonial has been shared successfully.');
            }
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery.location) params.location = searchQuery.location;
        if (searchQuery.category) params.category = searchQuery.category;
        if (searchQuery.priceRange) {
            const [min, max] = searchQuery.priceRange.split('-');
            if (min) params.min_price = min;
            if (max) params.max_price = max;
        }
        router.get('/products', params);
    };

    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Marete & Co Realty",
        "image": `${baseUrl}/images/og-cover.jpg`,
        "@id": `${baseUrl}/#realestateagent`,
        "url": baseUrl,
        "telephone": "+254 746 242 233",
        "priceRange": "$$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Block B",
            "addressLocality": "Nairobi",
            "addressCountry": "KE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -1.2921,
            "longitude": 36.8219
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "08:00",
            "closes": "17:30"
        }
    };

    return (
        <MainLayout>
            <Seo
                title="Luxury Real Estate Nairobi"
                description="Discover Kenya's finest addresses with Marete & Co Realty. Premium property sales, rentals, land acquisitions, off-plan investment, and property management in Nairobi."
                path="/"
                schema={schema}
            />

            {/* ── HERO SECTION WITH GLASSMORPHISM FILTER ── */}
            <section className="relative min-h-[90vh] flex items-center justify-center -mt-20 overflow-hidden bg-slate-950">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
                        alt="Luxury Estate in Nairobi"
                        className="w-full h-full object-cover opacity-45 scale-105 animate-[pulse_8s_infinite]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white bg-maroon-500/10 border border-maroon-500/20 mb-6 backdrop-blur-sm">
                        Nairobi's Premier Real Estate Brokerage
                    </span>
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white max-w-4xl leading-[1.1] tracking-wide">
                        Discover Kenya's <br />
                        <span >Finest Addresses</span>
                    </h1>
                    <p className="mt-6 text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed font-light">
                        Curated collection of ultra-luxury villas, executive apartments, prime land, and off-plan investments in Nairobi's secure enclaves.
                    </p>

                    {/* Glassmorphic Search Filter Bar */}
                    <form 
                        onSubmit={handleSearchSubmit}
                        className="mt-12 w-full max-w-4xl p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-left"
                    >
                        <div className="flex flex-col px-3 py-1">
                            <label className="text-[10px] font-bold text-maroon-500 uppercase tracking-widest">Location</label>
                            <select
                                value={searchQuery.location}
                                onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                                className="bg-transparent border-0 text-white font-medium text-sm p-0 pt-1 focus:ring-0 focus:outline-none w-full"
                            >
                                <option value="" className="text-slate-900">All Locations</option>
                                <option value="Karen" className="text-slate-900">Karen</option>
                                <option value="Runda" className="text-slate-900">Runda</option>
                                <option value="Kilimani" className="text-slate-900">Kilimani</option>
                                <option value="Westlands" className="text-slate-900">Westlands</option>
                                <option value="Lavington" className="text-slate-900">Lavington</option>
                            </select>
                        </div>

                        <div className="flex flex-col px-3 py-1 border-t md:border-t-0 md:border-l border-white/10">
                            <label className="text-[10px] font-bold text-maroon-500 uppercase tracking-widest">Category</label>
                            <select
                                value={searchQuery.category}
                                onChange={(e) => setSearchQuery({ ...searchQuery, category: e.target.value })}
                                className="bg-transparent border-0 text-white font-medium text-sm p-0 pt-1 focus:ring-0 focus:outline-none w-full"
                            >
                                <option value="" className="text-slate-900">All Listings</option>
                                <option value="sale" className="text-slate-900">For Sale</option>
                                <option value="rental" className="text-slate-900">For Rent</option>
                                <option value="land" className="text-slate-900">Prime Land</option>
                                <option value="off-plan" className="text-slate-900">Off-Plan Projects</option>
                            </select>
                        </div>

                        <div className="flex flex-col px-3 py-1 border-t md:border-t-0 md:border-l border-white/10">
                            <label className="text-[10px] font-bold text-maroon-500 uppercase tracking-widest">Budget (KES)</label>
                            <select
                                value={searchQuery.priceRange}
                                onChange={(e) => setSearchQuery({ ...searchQuery, priceRange: e.target.value })}
                                className="bg-transparent border-0 text-white font-medium text-sm p-0 pt-1 focus:ring-0 focus:outline-none w-full"
                            >
                                <option value="" className="text-slate-900">Any Budget</option>
                                <option value="0-10000000" className="text-slate-900">Under 10M</option>
                                <option value="10000000-50000000" className="text-slate-900">10M - 50M</option>
                                <option value="50000000-100000000" className="text-slate-900">50M - 100M</option>
                                <option value="100000000-999999999" className="text-slate-900">100M+</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 bg-maroon-600 hover:bg-maroon-500 text-white font-bold rounded-lg transition-all duration-200 shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:scale-[1.02]"
                        >
                            🔎 Search Address
                        </button>
                    </form>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="relative z-20 -mt-10 max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-10 px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label} className="flex flex-col">
                            <span className="font-serif text-3xl font-bold text-slate-950">{s.value}</span>
                            <span className="text-xs text-slate-500 mt-2 uppercase font-medium tracking-wider">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES OVERVIEW ── */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Our Expertise</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Bespoke Real Estate Services</h2>
                        <div className="w-12 h-1 bg-maroon-500 mx-auto mt-4" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🏡</div>
                            <h3 className="font-serif text-xl font-bold text-slate-950 mb-3">Premium Sales</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Representing buyers and sellers in high-value property acquisitions in Karen, Runda, Muthaiga, and Gigiri. Absolute confidentiality assured.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🔑</div>
                            <h3 className="font-serif text-xl font-bold text-slate-950 mb-3">Luxury Rentals</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Premium houses, penthouses, and executive apartments furnished for diplomats, corporate executives, and international relocation clients.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="font-serif text-xl font-bold text-slate-950 mb-3">Property Management</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Comprehensive management solutions for premium landlords: tenant vetting, collection, repairs, and legal compliance, maximizing yields.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURED PROPERTIES ── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                        <div>
                            <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Exclusives</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Featured Listings</h2>
                        </div>
                        <Link 
                            href="/products" 
                            className="mt-4 md:mt-0 font-semibold text-sm text-maroon-600 hover:text-maroon-700 flex items-center gap-1 group"
                        >
                            Explore All Properties <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <ProductCard key={p.slug} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CLIENT TESTIMONIALS ── */}
            <section className="py-24 bg-maroon-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-600 via-maroon-500 to-maroon-700 opacity-60" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-maroon-100 font-semibold uppercase tracking-widest text-xs">Testimonials</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2">Client Experiences</h2>
                        <div className="w-12 h-1 bg-white mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, idx) => (
                            <div 
                                key={t.id || idx} 
                                className="bg-maroon-950/40 backdrop-blur border border-maroon-500/20 rounded-xl p-8 relative flex flex-col justify-between"
                            >
                                <span className="text-5xl text-white/10 absolute top-4 left-4 font-serif">“</span>
                                <p className="text-sm text-slate-100 leading-relaxed italic relative z-10 pt-4 mb-6">
                                    "{t.quote}"
                                </p>
                                <div className="border-t border-maroon-500/20 pt-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-white">{t.name}</span>
                                            {t.location && <span className="text-xs text-maroon-100 mt-1">{t.location}</span>}
                                        </div>
                                        {t.rating && (
                                            <div className="text-amber-300 text-[10px] sm:text-xs shrink-0 tracking-tighter">
                                                {'★'.repeat(t.rating)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-maroon-950 font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow hover:shadow-lg hover:scale-[1.02]"
                        >
                            ✍️ Share Your Experience
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIAL SUBMISSION MODAL ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden p-6 relative">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-lg font-bold"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                        
                        <h3 className="font-serif text-2xl font-bold text-white mb-2">Share Your Experience</h3>
                        <p className="text-xs text-slate-400 mb-6">
                            Thank you for partnering with Marete & Co. Your feedback helps us continue providing Nairobi's premier real estate services.
                        </p>

                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="testimonial-name">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="testimonial-name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Sarah Sterling"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 text-white focus:outline-none"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="testimonial-location">
                                    Occupation / Location <span className="text-slate-500">(Optional)</span>
                                </label>
                                <input
                                    id="testimonial-location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g. Expats Community, Karen"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 text-white focus:outline-none"
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="testimonial-rating">
                                    Rating
                                </label>
                                <div className="flex gap-2 items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className="text-2xl focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <span className={star <= data.rating ? 'text-amber-400' : 'text-slate-600'}>★</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="testimonial-quote">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="testimonial-quote"
                                    required
                                    rows={4}
                                    value={data.quote}
                                    onChange={(e) => setData('quote', e.target.value)}
                                    placeholder="Tell others about your experience working with Marete & Co Realty..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 resize-none text-white focus:outline-none"
                                />
                                {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-maroon-600 hover:bg-maroon-500 disabled:bg-slate-700 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow"
                            >
                                {processing ? "Submitting..." : "Submit Testimonial"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── ACCORDION FAQS ── */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Assistance</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Frequently Asked Questions</h2>
                        <div className="w-12 h-1 bg-maroon-500 mx-auto mt-4" />
                    </div>
                    <FaqAccordion faqs={faqs} />
                </div>
            </section>

            {/* ── CALL TO ACTION ── */}
            <section className="py-20 bg-maroon-500 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 z-0" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">List Your Property With Marete &amp; Co</h2>
                    <p className="text-maroon-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed font-light">
                        Maximize exposure, secure qualified corporate tenants, or achieve premium sale prices for your residential developments in Nairobi.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-slate-950 hover:bg-slate-900 text-white font-bold px-10 py-4 rounded-lg text-sm tracking-wide uppercase transition-colors shadow-lg"
                    >
                        Schedule Private Consult
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}

