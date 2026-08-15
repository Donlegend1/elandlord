import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import ProductCard from '@/Components/ProductCard';

export default function Products({ products }) {
    // Get URL search parameters for initial filters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('category');
        const locParam = urlParams.get('location');
        const minPriceParam = urlParams.get('min_price');
        const maxPriceParam = urlParams.get('max_price');

        if (catParam) setSelectedCategory(catParam);
        if (locParam) setSelectedLocation(locParam);
        if (minPriceParam || maxPriceParam) {
            if (minPriceParam === '100000000') {
                setSelectedPriceRange('100M+');
            } else if (maxPriceParam === '10000000') {
                setSelectedPriceRange('Under 10M');
            } else if (maxPriceParam === '50000000') {
                setSelectedPriceRange('10M - 50M');
            } else if (maxPriceParam === '100000000') {
                setSelectedPriceRange('50M - 100M');
            }
        }
    }, []);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        let result = products;

        // Filter by search query
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.tagline && p.tagline.toLowerCase().includes(query)) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by location
        if (selectedLocation !== 'all') {
            result = result.filter(p => {
                const loc = p.specs?.location || '';
                return loc.toLowerCase().includes(selectedLocation.toLowerCase());
            });
        }

        // Filter by price range
        if (selectedPriceRange !== 'all') {
            result = result.filter(p => {
                const specs = p.specs || {};
                const priceStr = specs.price || '';
                // Extract numbers
                const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;

                if (selectedPriceRange === 'Under 10M') {
                    return numericPrice < 10000000;
                } else if (selectedPriceRange === '10M - 50M') {
                    return numericPrice >= 10000000 && numericPrice <= 50000000;
                } else if (selectedPriceRange === '50M - 100M') {
                    return numericPrice >= 50000000 && numericPrice <= 100000000;
                } else if (selectedPriceRange === '100M+') {
                    return numericPrice > 100000000;
                }
                return true;
            });
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, selectedLocation, selectedPriceRange, products]);

    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "E-Landlord Property Listings",
        "description": "Explore E-Landlord's portfolio of managed residential and commercial properties.",
        "url": `${baseUrl}/products`,
        "numberOfItems": products.length,
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${baseUrl}/products/${product.slug}`,
            "name": product.name,
            "description": product.tagline || product.description.substring(0, 150),
            "image": product.image && (product.image.startsWith('http') || product.image.startsWith('/') 
                ? product.image 
                : `${baseUrl}/images/products/${product.image}`)
        }))
    };

    return (
        <MainLayout>
            <Seo
                title="E-Landlord Managed Property Directory"
                description="Explore E-Landlord's portfolio of managed residential and commercial properties."
                path="/products"
                schema={schema}
            />

            {/* Header Banner */}
            <section
                className="relative bg-slate-950 text-white py-20 -mt-20 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80" 
                        alt="Nairobi Luxury Properties" 
                        className="w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/70" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-wide uppercase">
                        Our Property Portfolio
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl mx-auto font-light">
                        Discover upscale residential properties, premium leaseholds, and high-yielding off-plan investments across Nairobi's most prestigious districts.
                    </p>
                    <nav className="flex justify-center items-center space-x-2 text-xs text-slate-400">
                        <Link href="/" className="hover:text-maroon-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-maroon-500 font-medium">Portfolio</span>
                    </nav>
                </div>
            </section>

            {/* Filters and Listings section */}
            <section className="py-16 bg-slate-50 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Active Filter Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-12 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Search */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Keyword Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by keywords, villa, etc..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                >
                                    <option value="all">All Locations</option>
                                    <option value="Karen">Karen</option>
                                    <option value="Runda">Runda</option>
                                    <option value="Kilimani">Kilimani</option>
                                    <option value="Westlands">Westlands</option>
                                    <option value="Lavington">Lavington</option>
                                </select>
                            </div>

                            {/* Price range */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Price Range (KES)</label>
                                <select
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    className="border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
                                >
                                    <option value="all">Any Price</option>
                                    <option value="Under 10M">Under KES 10M</option>
                                    <option value="10M - 50M">KES 10M - 50M</option>
                                    <option value="50M - 100M">KES 50M - 100M</option>
                                    <option value="100M+">KES 100M+</option>
                                </select>
                            </div>
                        </div>

                        {/* Category tabs */}
                        <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-2 items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'All Listings' },
                                    { id: 'sale', label: 'For Sale' },
                                    { id: 'rental', label: 'For Rent' },
                                    { id: 'land', label: 'Prime Land' },
                                    { id: 'off-plan', label: 'Off-Plan Projects' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedCategory(tab.id)}
                                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${selectedCategory === tab.id ? 'bg-maroon-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            
                            <span className="text-xs text-slate-400 font-medium">
                                Showing <strong className="text-slate-800">{filteredProducts.length}</strong> listings
                            </span>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.slug} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 px-4 text-center max-w-lg mx-auto">
                            <span className="text-5xl">🔍</span>
                            <h3 className="font-serif text-lg font-bold text-slate-800 mt-4">No matching addresses found</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Try adjusting your filters, clearing the search keyword, or selecting "All Listings" to browse all properties.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSelectedLocation('all');
                                    setSelectedPriceRange('all');
                                }}
                                className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-maroon-600 text-white font-medium text-xs rounded-lg transition-colors uppercase tracking-wider"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

