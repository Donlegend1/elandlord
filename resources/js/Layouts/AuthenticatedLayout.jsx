import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-purple-200">Super Admin</span>;
            case 'landlord':
                return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">Landlord / Owner</span>;
            case 'assistant':
                return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-200">Assistant</span>;
            case 'agent':
                return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-200">Agent</span>;
            case 'tenant':
                return <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-indigo-200">Tenant</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Navigation */}
            <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center space-x-6">
                            {/* Logo */}
                            <Link href={route('dashboard')} className="flex items-center gap-2 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                                    E
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg tracking-tight text-slate-800 leading-none">E-Landlord</span>
                                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Property Hub</span>
                                </div>
                            </Link>

                            {/* Main Nav Links */}
                            <div className="hidden space-x-6 sm:-my-px sm:ms-6 sm:flex items-center">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>

                                {(['super_admin', 'landlord', 'assistant', 'agent'].includes(user.role)) && (
                                    <NavLink href={route('properties.index')} active={route().current('properties.*')}>
                                        Properties
                                    </NavLink>
                                )}

                                {(['super_admin', 'landlord', 'assistant', 'agent'].includes(user.role)) && (
                                    <NavLink href={route('tenants.index')} active={route().current('tenants.*')}>
                                        Tenants & History
                                    </NavLink>
                                )}

                                {(['super_admin', 'landlord'].includes(user.role)) && (
                                    <NavLink href={route('assistants.index')} active={route().current('assistants.*')}>
                                        Assistants
                                    </NavLink>
                                )}

                                <NavLink href={route('receipts.index')} active={route().current('receipts.*')}>
                                    Payment Receipts
                                </NavLink>

                                <NavLink href={route('renewals.index')} active={route().current('renewals.*')}>
                                    Renewal Alerts
                                </NavLink>

                                <NavLink href={route('maintenance.index')} active={route().current('maintenance.*')}>
                                    Maintenance
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-4">
                            {/* Role Badge */}
                            <div>{getRoleBadge(user.role)}</div>

                            {/* User Menu Dropdown */}
                            <div className="relative ms-2">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span>{user.name}</span>

                                            <svg
                                                className="h-4 w-4 text-slate-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100">
                                            Signed in as <strong className="text-slate-800">{user.email}</strong>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-b border-slate-200'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        {(['super_admin', 'landlord', 'assistant', 'agent'].includes(user.role)) && (
                            <ResponsiveNavLink href={route('properties.index')} active={route().current('properties.*')}>
                                Properties
                            </ResponsiveNavLink>
                        )}
                        {(['super_admin', 'landlord', 'assistant', 'agent'].includes(user.role)) && (
                            <ResponsiveNavLink href={route('tenants.index')} active={route().current('tenants.*')}>
                                Tenants & History
                            </ResponsiveNavLink>
                        )}
                        {(['super_admin', 'landlord'].includes(user.role)) && (
                            <ResponsiveNavLink href={route('assistants.index')} active={route().current('assistants.*')}>
                                Assistants
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink href={route('receipts.index')} active={route().current('receipts.*')}>
                            Payment Receipts
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('renewals.index')} active={route().current('renewals.*')}>
                            Renewal Alerts
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('maintenance.index')} active={route().current('maintenance.*')}>
                            Maintenance
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-base font-medium text-slate-800">{user.name}</div>
                                <div className="text-xs font-medium text-slate-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white text-sm py-2.5 px-4 text-center font-medium shadow-sm flex justify-center items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {flash.success}
                </div>
            )}

            {/* Page Header */}
            {header && (
                <header className="bg-white border-b border-slate-200 shadow-xs">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
