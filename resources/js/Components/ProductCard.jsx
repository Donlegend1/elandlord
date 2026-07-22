import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const specs = product.specs || {};
    const price = specs.price || 'Price on Request';
    const location = specs.location || 'Nairobi, Kenya';
    const bedrooms = specs.bedrooms !== undefined ? specs.bedrooms : 0;
    const bathrooms = specs.bathrooms !== undefined ? specs.bathrooms : 0;
    const area = specs.area || '';
    const status = specs.status || (product.category === 'rental' ? 'For Rent' : 'For Sale');

    // Category mapping for badge
    const categoryLabels = {
        'sale': 'For Sale',
        'rental': 'For Rent',
        'land': 'Prime Land',
        'off-plan': 'Off-Plan Investment'
    };
    
    const categoryLabel = categoryLabels[product.category] || product.category;

    // Image URL handler
    const imageUrl = product.image && (product.image.startsWith('http') || product.image.startsWith('/')) 
        ? product.image 
        : `/images/products/${product.image || 'villa.jpg'}`;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase bg-slate-900/90 text-white rounded-md backdrop-blur-sm">
                        {categoryLabel}
                    </span>
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-4 right-4 bg-maroon-600 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow backdrop-blur-sm">
                    {price}
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-2">
                    <span className="text-maroon-500">📍</span> {location}
                </div>
                
                <h3 className="font-serif text-lg font-bold text-slate-950 group-hover:text-maroon-600 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                
                <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">
                    {product.tagline || product.description}
                </p>
                
                {/* Details Footer */}
                <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between text-xs text-slate-600">
                    {product.category !== 'land' ? (
                        <>
                            <span className="flex items-center gap-1">
                                🛏️ <strong className="text-slate-900">{bedrooms}</strong> Beds
                            </span>
                            <span className="flex items-center gap-1">
                                🛁 <strong className="text-slate-900">{bathrooms}</strong> Baths
                            </span>
                        </>
                    ) : (
                        <span className="flex items-center gap-1">
                            🌱 <strong className="text-slate-900">Residential Plot</strong>
                        </span>
                    )}
                    {area && (
                        <span className="flex items-center gap-1">
                            📐 <strong className="text-slate-900">{area}</strong>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

