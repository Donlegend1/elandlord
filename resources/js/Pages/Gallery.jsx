import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';

const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Karen Executive Villa' },
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', alt: 'Kilimani Luxury Penthouse' },
    { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', alt: 'Runda Diplomatic Mansion' },
    { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', alt: 'Westlands Serviced Apartments' },
    { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', alt: 'Lavington Off-Plan Render' },
    { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', alt: 'Luxury Living Room Design' },
    { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', alt: 'Infinity Swimming Pool' },
    { src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80', alt: 'Exclusive Kitchen Fitting' },
];

export default function Gallery() {
    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const schema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "Marete & Co Realty Portfolio Gallery",
        "description": "Curated collection of visual portfolios for luxury villas, apartments, townhouses and premium plots in Nairobi.",
        "url": `${baseUrl}/gallery`,
        "image": galleryImages.map(img => img.src)
    };

    return (
        <MainLayout>
            <Seo
                title="Portfolio Gallery - Luxury Homes & Estates"
                description="View our curated photo gallery showcasing luxury houses, penthouse interiors, pools, kitchens, and scenic land locations across Nairobi."
                path="/gallery"
                schema={schema}
            />

            {/* Page Banner */}
            <div
                className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center -mt-20 overflow-hidden"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950 bg-opacity-65"></div>
                <div className="relative z-10 text-center px-4 pt-10">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-wide">
                        Portfolio Gallery
                    </h1>
                    <p className="text-sm sm:text-base text-maroon-400 mb-4 font-light">
                        Visualizing Nairobi's finest addresses and interior spaces
                    </p>
                    <nav className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                        <Link href="/" className="hover:text-maroon-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-maroon-500 font-medium">Gallery</span>
                    </nav>
                </div>
            </div>

            {/* Image Grid */}
            <section className="bg-slate-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square overflow-hidden rounded-xl shadow-sm border border-slate-100 bg-white"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white text-sm font-semibold tracking-wider uppercase font-serif">
                                        {image.alt}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-slate-900 py-16 px-4 text-center text-white relative">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                        Interested in a Private Tour?
                    </h2>
                    <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                        We organize exclusive, private viewing schedules for all our listed villas, penthouses, and properties. Speak with our lead agents to coordinate.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-maroon-600 hover:bg-maroon-500 text-white font-bold px-8 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors shadow"
                    >
                        Schedule Viewing
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}

