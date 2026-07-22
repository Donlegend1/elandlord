import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Head title="E-Landlord - Digital Property Management System" />

            {/* Header / Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                            E
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight text-white leading-none">E-LANDLORD</span>
                            <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">Digital Property Hub</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={route('login')}
                            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            href={route('register')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-24 px-6 max-w-6xl mx-auto text-center">
                <div className="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                    Multi-Role Property Management Platform
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                    Manage Properties, Tenants & Receipts <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">100% Digitally</span>
                </h1>

                <p className="mt-6 text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                    Designed for <strong>Landlords/Owners</strong>, <strong>Assistants</strong>, <strong>Agents</strong>, and <strong>Tenants</strong>. Register properties, create assistant accounts with custom property assignments, generate digital receipts, and track lease renewal alerts.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link
                        href={route('register')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl transition"
                    >
                        Register Property / Landlord Account
                    </Link>
                    <Link
                        href={route('login')}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-base px-8 py-4 rounded-2xl border border-slate-700 transition"
                    >
                        Log In to Portal
                    </Link>
                </div>
            </section>

            {/* Demo Role Switcher Quick Access Section */}
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Demo Credentials</h2>
                        <p className="text-slate-400 text-sm mt-2">Log in with pre-seeded accounts to experience each unique user role interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Landlord Card */}
                        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded">Role 1: Landlord / Owner</span>
                                <h3 className="font-bold text-white text-lg mt-3">Alexander Sterling</h3>
                                <p className="text-xs text-slate-400 mt-1">Full control over properties, unit rentals, assistants, and revenue.</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
                                <div>Email: <strong className="text-indigo-400">landlord@elandlord.com</strong></div>
                                <div>Pass: <strong className="text-indigo-400">password</strong></div>
                            </div>
                        </div>

                        {/* Assistant Card */}
                        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded">Role 2: Assistant</span>
                                <h3 className="font-bold text-white text-lg mt-3">Sarah Connor</h3>
                                <p className="text-xs text-slate-400 mt-1">Assigned specific properties by Landlord to handle tenants & receipts.</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
                                <div>Email: <strong className="text-indigo-400">assistant@elandlord.com</strong></div>
                                <div>Pass: <strong className="text-indigo-400">password</strong></div>
                            </div>
                        </div>

                        {/* Tenant Card */}
                        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2.5 py-1 rounded">Role 3: Tenant</span>
                                <h3 className="font-bold text-white text-lg mt-3">John Doe</h3>
                                <p className="text-xs text-slate-400 mt-1">View active lease, download digital payment receipts & report maintenance.</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
                                <div>Email: <strong className="text-indigo-400">tenant@elandlord.com</strong></div>
                                <div>Pass: <strong className="text-indigo-400">password</strong></div>
                            </div>
                        </div>

                        {/* Super Admin Card */}
                        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2.5 py-1 rounded">Role 4: Super Admin</span>
                                <h3 className="font-bold text-white text-lg mt-3">System Administrator</h3>
                                <p className="text-xs text-slate-400 mt-1">Platform-wide metrics and user role oversight.</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
                                <div>Email: <strong className="text-indigo-400">admin@elandlord.com</strong></div>
                                <div>Pass: <strong className="text-indigo-400">password</strong></div>
                            </div>
                        </div>

                        {/* Agent Card */}
                        <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded">Role 5: Agent</span>
                                <h3 className="font-bold text-white text-lg mt-3">Michael Vance</h3>
                                <p className="text-xs text-slate-400 mt-1">Agent assisting with properties and tenant onboarding.</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
                                <div>Email: <strong className="text-indigo-400">agent@elandlord.com</strong></div>
                                <div>Pass: <strong className="text-indigo-400">password</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
