import { useState, useEffect } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import ProductCard from '@/Components/ProductCard';

export default function Show({ product, related }) {
    const specs = product.specs || {};
    const price = specs.price || 'Price on Request';
    const location = specs.location || 'Nairobi, Kenya';
    const bedrooms = specs.bedrooms !== undefined ? specs.bedrooms : 0;
    const bathrooms = specs.bathrooms !== undefined ? specs.bathrooms : 0;
    const area = specs.area || '';
    const status = specs.status || (product.category === 'rental' ? 'For Rent' : 'For Sale');
    const amenities = specs.amenities || [];
    const propertyType = specs.type || 'Property';

    const images = specs.images && specs.images.length > 0 ? specs.images : (product.image ? [product.image] : []);
    const [activeImage, setActiveImage] = useState(images[0] || 'villa.jpg');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const openModal = (index) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextModalImage = (e) => {
        e.stopPropagation();
        setModalIndex((prev) => (prev + 1) % images.length);
    };

    const prevModalImage = (e) => {
        e.stopPropagation();
        setModalIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight' && images.length > 1) setModalIndex((prev) => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft' && images.length > 1) setModalIndex((prev) => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, images]);

    const getImageUrl = (img) => {
        return img && (img.startsWith('http') || img.startsWith('/')) 
            ? img 
            : `/images/products/${img || 'villa.jpg'}`;
    };

    // Inquiry Form handling
    const { data, setData, post, processing, success, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: `Inquiry regarding: ${product.name}`,
        message: `Hello, I am interested in "${product.name}" located in ${location}. Please send me more details.`,
    });

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
                alert('Thank you! Your inquiry has been submitted. Our property consultants will contact you shortly.');
            }
        });
    };

    // Category label
    const categoryLabels = {
        'sale': 'For Sale',
        'rental': 'For Rent',
        'land': 'Prime Land',
        'off-plan': 'Off-Plan Development'
    };
    const categoryLabel = categoryLabels[product.category] || product.category;



    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const numericPrice = parseInt((specs.price || '').replace(/[^0-9]/g, '')) || 0;
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "SingleFamilyResidence",
        "name": product.name,
        "description": product.tagline || product.description,
        "image": images.map(img => getImageUrl(img)),
        "address": {
            "@type": "PostalAddress",
            "addressLocality": location,
            "addressRegion": "Nairobi",
            "addressCountry": "KE"
        },
        "numberOfRooms": (bedrooms || 0) + (bathrooms || 0),
        "numberOfBedrooms": bedrooms || 0,
        "numberOfBathrooms": bathrooms || 0,
        "floorSize": area ? {
            "@type": "QuantitativeValue",
            "value": parseInt(area.replace(/[^0-9]/g, '')) || 0,
            "unitCode": area.toLowerCase().includes('sq') ? 'FTK' : 'MTK'
        } : undefined,
        "offers": numericPrice > 0 ? {
            "@type": "Offer",
            "priceCurrency": "KES",
            "price": numericPrice,
            "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": numericPrice,
                "priceCurrency": "KES",
                "referenceQuantity": {
                    "@type": "QuantitativeValue",
                    "value": 1,
                    "unitCode": "C62"
                }
            }
        } : {
            "@type": "Offer",
            "price": "Price on Request"
        }
    };

    return (
        <MainLayout>
            <Seo
                title={product.name}
                description={product.tagline || product.description.substring(0, 150)}
                path={`/products/${product.slug}`}
                image={product.image || activeImage}
                schema={schema}
            />

            {/* Property Hero cover banner */}
            <section className="relative h-[65vh] -mt-20 overflow-hidden bg-slate-950">
                <img
                    src={getImageUrl(activeImage)}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/20" />
                
                {/* Header Information overlay */}
                <div className="absolute bottom-0 left-0 right-0 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-white">
                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-maroon-600 text-white rounded-md mb-3 inline-block">
                                {categoryLabel}
                            </span>
                            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-wide drop-shadow-md">
                                {product.name}
                            </h1>
                            <p className="mt-2 text-slate-300 text-sm sm:text-base font-light flex items-center gap-1">
                                📍 {location}
                            </p>
                        </div>
                        
                        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-4 sm:px-6 sm:py-4 rounded-xl text-white md:text-right shrink-0">
                            <span className="text-[10px] uppercase font-bold text-maroon-500 tracking-wider">Asking Price</span>
                            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{price}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
                <div className="bg-slate-900 py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-850">
                    <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative w-24 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                                    activeImage === img ? 'border-maroon-500 scale-105' : 'border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                <img
                                    src={getImageUrl(img)}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Property Info Grid */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Metrics Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-10 flex flex-wrap gap-8 justify-around text-center">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Property Type</span>
                            <span className="text-slate-800 font-bold mt-1 text-sm sm:text-base">{propertyType}</span>
                        </div>
                        {product.category !== 'land' && (
                            <>
                                <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Bedrooms</span>
                                    <span className="text-slate-800 font-bold mt-1 text-sm sm:text-base">{bedrooms} Ensuite</span>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Bathrooms</span>
                                    <span className="text-slate-800 font-bold mt-1 text-sm sm:text-base">{bathrooms} Baths</span>
                                </div>
                            </>
                        )}
                        {area && (
                            <>
                                <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Area size</span>
                                    <span className="text-slate-800 font-bold mt-1 text-sm sm:text-base">{area}</span>
                                </div>
                            </>
                        )}
                        <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Listing Status</span>
                            <span className="text-maroon-600 font-bold mt-1 text-sm sm:text-base uppercase tracking-wider">{status}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                        {/* Main Description */}
                        <div className="lg:col-span-2 space-y-10">
                            
                            {/* Property Overview */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                                <h2 className="font-serif text-2xl font-bold text-slate-950 mb-4">Overview</h2>
                                <p className="text-sm font-medium text-slate-500 italic mb-6">
                                    {product.tagline}
                                </p>
                                <div className="w-12 h-1 bg-maroon-500 mb-6" />
                                <div className="text-slate-600 leading-relaxed text-sm space-y-4 whitespace-pre-line">
                                    {product.description}
                                </div>
                            </div>

                            {/* Amenities checklist */}
                            {amenities.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                                    <h2 className="font-serif text-2xl font-bold text-slate-950 mb-6">Premium Amenities</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {amenities.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                                                <span className="text-maroon-500 text-lg">✓</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Photo Gallery */}
                            {images.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                                    <h2 className="font-serif text-2xl font-bold text-slate-950 mb-2">Photo Gallery</h2>
                                    <p className="text-xs text-slate-400 mb-6">Click any image to view it in full size.</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => openModal(idx)}
                                                className="relative aspect-video rounded-lg overflow-hidden group border border-slate-100 hover:border-maroon-500/50 transition-all hover:shadow"
                                            >
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`Gallery view ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-[11px] font-bold uppercase tracking-wider bg-maroon-600/90 px-3 py-1.5 rounded-md shadow-sm">
                                                        View
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Agent Inquiry Form Sidebar */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-slate-100 p-8 sticky top-32">
                            <h3 className="font-serif text-xl font-bold text-slate-950 mb-2">Request Information</h3>
                            <p className="text-xs text-slate-400 mb-6">Schedule a viewing or chat with our premium agents.</p>
                            
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g. john@domain.com"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                    />
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="e.g. +254 700 000 000"
                                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                    />
                                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                    ></textarea>
                                    {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-maroon-600 hover:bg-maroon-500 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors text-sm uppercase tracking-wider shadow"
                                >
                                    {processing ? 'Submitting...' : 'Send Inquiry'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Related Properties */}
                    {related && related.length > 0 && (
                        <div className="border-t border-slate-200 mt-20 pt-16">
                            <h3 className="font-serif text-2xl font-bold text-slate-950 mb-8">Similar Properties</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {related.map((item) => (
                                    <ProductCard key={item.slug} product={item} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* Lightbox / Modal for Gallery */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between items-center p-4 transition-all duration-300"
                    onClick={closeModal}
                >
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white transition-colors"
                        aria-label="Close modal"
                    >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                         </svg>
                    </button>

                    <div className="flex-1 w-full flex items-center justify-center">
                        {/* Main image container */}
                        <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={getImageUrl(images[modalIndex])}
                                alt={`Fullscreen view ${modalIndex + 1}`}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                            />

                            {/* Navigation arrows (if there are multiple images) */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevModalImage}
                                        className="absolute -left-4 sm:left-4 p-3 rounded-full bg-slate-900/65 hover:bg-slate-800 text-white transition-colors shadow-lg"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextModalImage}
                                        className="absolute -right-4 sm:right-4 p-3 rounded-full bg-slate-900/65 hover:bg-slate-800 text-white transition-colors shadow-lg"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Image index indicator */}
                    <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-full select-none mb-4">
                        {modalIndex + 1} of {images.length}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

