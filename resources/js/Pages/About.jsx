import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const features = [
    {
        icon: '🏢',
        title: 'Property Registration & Unit Setup',
        desc: 'Easily register properties, apartments, multi-family units, commercial spaces, and track vacancy status in real-time.',
    },
    {
        icon: '👥',
        title: 'Assistant Account Delegation',
        desc: 'Landlords can create property assistants and grant scoped access to specific properties for seamless operational support.',
    },
    {
        icon: '📄',
        title: 'Printable Digital Payment Receipts',
        desc: 'Record rent payments and automatically generate official digital receipts (#EL-2026-XXXX) formatted for instant printing or PDF download.',
    },
    {
        icon: '⏰',
        title: 'Lease Renewal Reminders',
        desc: 'Automated 30-day and 60-day lease expiration warnings prevent lost rent and allow 1-click lease extensions.',
    },
    {
        icon: '📂',
        title: 'Tenant Rental Property History',
        desc: 'Keep complete digital history of tenant active and past leases, rent payments, and maintenance tickets.',
    },
    {
        icon: '🔧',
        title: 'Tenant Maintenance Request Portal',
        desc: 'Tenants submit repair tickets directly from their portal, while landlords and assistants update resolution status.',
    },
];

export default function About() {
    return (
        <MainLayout>
            <Head>
                <title>About E-Landlord - Digital Property Management System</title>
                <meta name="description" content="Learn about E-Landlord — the online app for landlords to manage properties, tenants, assistants, digital receipts, and renewal reminders." />
            </Head>

            <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">About E-Landlord</span>
                    <h1 className="text-4xl font-extrabold mt-4 sm:text-5xl">Everything Digital About Managing Properties</h1>
                    <p className="mt-4 text-slate-300 text-lg leading-relaxed font-light">
                        E-Landlord empowers property owners and managers to digitize every step of property management — from registering units and assigning managing assistants to generating payment receipts and tracking tenant rental history.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">Core Features & Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-10 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-3xl font-bold">Ready to Simplify Property Management?</h3>
                        <p className="text-indigo-200 text-sm mt-2 max-w-xl">
                            Join thousands of landlords who rely on E-Landlord to streamline property management, tenant records, and receipts.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition whitespace-nowrap text-base"
                    >
                        Register Property / Landlord Account &rarr;
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
