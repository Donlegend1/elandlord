import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';
import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

function formatRent(amount) {
    if (amount === null || amount === undefined || amount === '') return null;
    return Number(amount).toLocaleString();
}

export default function ListingsIndex({ properties, filters, countries = [], states: initialStates = [], sizes = [] }) {
    const { data, setData, get, processing } = useForm({
        country_id: filters.country_id || '',
        state_id: filters.state_id || '',
        size: filters.size || '',
    });

    const [states, setStates] = useState(initialStates);
    const [loadingStates, setLoadingStates] = useState(false);

    useEffect(() => {
        setStates(initialStates);
    }, [initialStates]);

    useEffect(() => {
        if (!data.country_id) {
            setStates([]);
            return;
        }

        let cancelled = false;
        setLoadingStates(true);

        axios
            .get(route('locations.states'), { params: { country_id: data.country_id } })
            .then((response) => {
                if (!cancelled) {
                    setStates(response.data.states || []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStates([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingStates(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [data.country_id]);

    const handleCountryChange = (countryId) => {
        setData({
            ...data,
            country_id: countryId,
            state_id: '',
        });
    };

    const search = (e) => {
        e.preventDefault();
        get(route('listings.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const listings = properties.data || properties;

    return (
        <MainLayout>
            <Seo
                title="Browse Properties"
                description="Search rental properties by country, state, and size. View details and contact the listing agent or landlord."
                path="/listings"
            />

            <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
                        Public Listings
                    </span>
                    <h1 className="text-4xl font-extrabold mt-4 sm:text-5xl">Find a Property</h1>
                    <p className="mt-4 text-slate-300 text-lg font-light max-w-2xl">
                        Search by country, state or province, and size. Open a listing for full details and contact the agent or landlord.
                    </p>

                    <form onSubmit={search} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Country</label>
                            <select
                                className="w-full rounded-xl border-slate-700 bg-slate-800 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.country_id}
                                onChange={(e) => handleCountryChange(e.target.value)}
                            >
                                <option value="">All countries</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">State / Province</label>
                            <select
                                className="w-full rounded-xl border-slate-700 bg-slate-800 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
                                value={data.state_id}
                                onChange={(e) => setData('state_id', e.target.value)}
                                disabled={!data.country_id || loadingStates}
                            >
                                <option value="">
                                    {!data.country_id ? 'Select a country first' : loadingStates ? 'Loading…' : 'All states'}
                                </option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Size</label>
                            <select
                                className="w-full rounded-xl border-slate-700 bg-slate-800 text-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.size}
                                onChange={(e) => setData('size', e.target.value)}
                            >
                                <option value="">Any size</option>
                                {sizes.map((size) => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow transition"
                            >
                                {processing ? 'Searching…' : 'Search properties'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <p className="text-sm text-slate-500 mb-8">
                    {properties.total ?? listings.length} { (properties.total ?? listings.length) === 1 ? 'property' : 'properties' } found
                </p>

                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                        <div className="text-4xl mb-3">🏠</div>
                        <h2 className="text-xl font-bold text-slate-900">No properties match these filters</h2>
                        <p className="text-sm text-slate-500 mt-2">Try another country, state, or size.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((prop) => (
                            <Link
                                key={prop.id}
                                href={route('listings.show', prop.id)}
                                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition"
                            >
                                <div className="h-44 relative overflow-hidden bg-gradient-to-tr from-slate-800 to-indigo-900">
                                    {prop.image_url ? (
                                        <img src={prop.image_url} alt={prop.name} className="absolute inset-0 w-full h-full object-cover" />
                                    ) : null}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                    <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                                        {prop.type}
                                    </span>
                                    <div className="absolute bottom-4 left-5 right-5 text-white">
                                        <h3 className="text-lg font-extrabold tracking-tight leading-snug">{prop.name}</h3>
                                        <p className="text-xs text-slate-300 mt-1">
                                            📍 {[prop.city, prop.state, prop.country].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                                        <div>
                                            <div className="text-slate-400 font-medium">Size</div>
                                            <div className="font-bold text-slate-800">{prop.size_label}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 font-medium">From</div>
                                            <div className="font-bold text-slate-800">
                                                {formatRent(prop.min_rent) ? `$${formatRent(prop.min_rent)}` : 'Ask'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs py-2.5 rounded-xl transition">
                                        View details & contact
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {properties.links && properties.links.length > 3 && (
                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                                {properties.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            className={
                                                'min-w-9 px-3 py-2 rounded-lg text-xs font-semibold border transition ' +
                                                (link.active
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300')
                                            }
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="min-w-9 px-3 py-2 rounded-lg text-xs font-semibold border bg-slate-50 text-slate-300 border-slate-100"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
