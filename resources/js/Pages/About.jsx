import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';

const values = [
    {
        icon: '🛡️',
        title: 'Absolute Integrity',
        desc: 'Our boutique advisory services operate with complete transparency, protecting our clients\' privacy and interests above all else.',
    },
    {
        icon: '💎',
        title: 'Bespoke Quality',
        desc: 'We curate only premium addresses and off-plan assets that guarantee high rental yields and excellent capital appreciation.',
    },
    {
        icon: '📈',
        title: 'Unrivaled Expertise',
        desc: 'With over 12 years of localized knowledge in Nairobi\'s luxury suburbs, we provide top-tier negotiation and market valuation advisory.',
    },
];

const timeline = [
    { year: '2014', event: 'Marete & Co Realty was founded in Nairobi, specializing in exclusive residential sales in Karen and Runda.' },
    { year: '2018', event: 'Expanded operations to luxury rental management, catering to diplomatic missions, expats, and corporate clients.' },
    { year: '2021', event: 'Launched our Off-Plan Investment Advisory division, partnering with tier-1 developers in Westlands, Kileleshwa, and Lavington.' },
    { year: '2026', event: 'Surpassed KES 15 Billion in managed property value, reinforcing our position as Nairobi\'s premier boutique realty.' },
];

export default function About() {
    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": `${baseUrl}/about/#webpage`,
                "url": `${baseUrl}/about`,
                "name": "About Us - Marete & Co Realty",
                "description": "Learn about Marete & Co Realty — Nairobi's premier boutique real estate agency specializing in luxury sales, rentals, land, and off-plan advisory."
            },
            {
                "@type": "RealEstateAgent",
                "@id": `${baseUrl}/#realestateagent`,
                "name": "Marete & Co Realty",
                "url": baseUrl,
                "logo": `${baseUrl}/images/logo.png`,
                "telephone": "+254 746 242 233",
                "email": "Mareteco9@gmail.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Block B",
                    "addressLocality": "Nairobi",
                    "addressCountry": "KE"
                }
            }
        ]
    };

    return (
        <MainLayout>
            <Seo
                title="About Us - Luxury Property Consultants"
                description="Learn about Marete & Co Realty — Nairobi's premier boutique real estate agency specializing in luxury sales, rentals, land, and off-plan advisory."
                path="/about"
                schema={schema}
            />

            {/* Page Banner */}
            <section
                className="relative bg-slate-950 text-white py-24 -mt-20 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" 
                        alt="Marete & Co Offices" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/70" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-wide uppercase">About Our Agency</h1>
                    <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl mx-auto font-light">
                        Guiding discerning buyers and high-net-worth investors to Nairobi's finest real estate properties since 2014.
                    </p>
                    <nav className="flex justify-center items-center space-x-2 text-xs text-slate-400">
                        <Link href="/" className="hover:text-maroon-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-maroon-500 font-medium">About Us</span>
                    </nav>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="rounded-xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                                alt="Luxury Villa Nairobi"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Our Identity</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2 mb-6">A Legacy of Trust, Privacy &amp; Premium Results</h2>
                            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                                <p>
                                    Marete &amp; Co Realty is a boutique real estate brokerage and investment advisory firm headquartered in Nairobi. Since inception, we have catered exclusively to local and international clients seeking premium residential homes, executive diplomatic rentals, and high-growth land plots.
                                </p>
                                <p>
                                    Our portfolio spans Nairobi's most prestigious and secure neighborhoods—including Karen, Runda, Muthaiga, Gigiri, Westlands, and Lavington. We represent sellers and buyers with an analytical, research-driven approach to valuations, ensuring our clients lock in absolute value.
                                </p>
                                <p>
                                    Whether you are looking to purchase a multi-generational estate in Karen, source a corporate rental for diplomatic staff, buy land in Tigoni, or build a high-yielding apartment portfolio in Westlands, our boutique team provides discrete, personalized, and professional guidance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Our Creed</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Core Principles</h2>
                        <div className="w-12 h-1 bg-maroon-500 mx-auto mt-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="text-4xl mb-5">{value.icon}</div>
                                <h3 className="font-serif text-lg font-bold text-slate-950 mb-3">{value.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline / Journey */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">History</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Milestones &amp; Growth</h2>
                        <div className="w-12 h-1 bg-maroon-500 mx-auto mt-4" />
                    </div>
                    <div className="relative border-l-2 border-maroon-200 ml-4 md:ml-32 space-y-12">
                        {timeline.map((item, index) => (
                            <div key={index} className="relative pl-8 md:pl-12">
                                {/* Dot indicator */}
                                <div className="absolute -left-[9px] top-1 bg-maroon-600 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center"></div>
                                {/* Content */}
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <span className="font-serif font-black text-maroon-600 text-lg md:w-20 shrink-0">{item.year}</span>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow transition-shadow">
                                        <p className="text-slate-700 text-sm leading-relaxed">{item.event}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="text-maroon-600 font-semibold uppercase tracking-widest text-xs">Our Founder</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mt-2">Executive Leadership</h2>
                    </div>
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-2/5 flex-shrink-0 aspect-[4/5] md:aspect-auto">
                                <img
                                    src="/images/ceo.jpeg"
                                    alt="Tasnim Rajab, CEO of Marete & Co"
                                    loading="lazy"
                                    className="w-full h-72 md:h-full object-cover"
                                />
                            </div>
                            <div className="md:w-3/5 p-8">
                                <h3 className="font-serif text-2xl font-bold text-slate-950 mb-1">Tasnim Rajab</h3>
                                <span className="inline-block bg-maroon-50 text-maroon-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Founder &amp; Managing Director</span>
                                <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                                    <p>
                                       Tasnim Rajab is the Founder and Chief Executive Officer of Marete & Co, a real estate and investment consultancy committed to helping clients make confident property decisions.   </p>
                                    <p>
                                        With a client-first approach, Tasnim  specializes in residential and commercial property sales, investment advisory, property sourcing, and interior furnishing solutions. Her passion is to connect people with the right opportunities while delivering exceptional service built on integrity, professionalism, and transparency.
                                    </p>
                                     <p>
                                       Under her leadership, Marete & Co has grown into a trusted brand dedicated to creating value for homeowners, investors, developers, and businesses. She believes that every property transaction is more than a sale, it's the beginning of a lasting relationship.
                                    </p>
                                    <p>Driven by excellence and a vision to redefine the real estate experience, Tasnim continues to lead Marete & Co with innovation, dedication, and an unwavering commitment to her clients' success.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

