import { useState, useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import ProductCard from '@/Components/ProductCard';

export default function ProductsIndex({ products }) {
    const [category, setCategory] = useState('all');

    const filtered = useMemo(
        () => (category === 'all' ? products : products.filter((p) => p.category === category)),
        [category, products]
    );

    return (
        <MainLayout>
            <Seo
                title="Products"
                description="Browse Afrik Minerals' full catalog of certified gold and Kimberley Process compliant diamonds, with purity, grading, and lead time for each product."
                path="/products"
            />

            <section className="container-page py-16 md:py-20">
                <span className="text-[11px] uppercase tracking-widest font-mono text-oxide">Catalog</span>
                <h1 className="font-display text-4xl text-slate-900 mt-3">Our Products</h1>
                <p className="mt-4 text-ink/70 max-w-xl leading-relaxed">
                    Every product page lists purity or grading, certification, and typical
                    lead time so you know exactly what you're ordering.
                </p>

                <div className="mt-8 flex gap-3">
                    {['all', 'gold', 'diamond'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-sm text-sm font-semibold border transition-colors ${
                                category === c
                                    ? 'bg-malachite text-paper border-malachite'
                                    : 'border-ink/15 text-ink/70 hover:border-malachite'
                            }`}
                        >
                            {c === 'all' ? 'All Products' : c === 'gold' ? 'Gold' : 'Diamonds'}
                        </button>
                    ))}
                </div>

                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((p) => (
                        <ProductCard key={p.slug} product={p} />
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
