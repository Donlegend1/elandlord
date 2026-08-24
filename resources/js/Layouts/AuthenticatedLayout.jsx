import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const icons = {
    dashboard: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    ),
    properties: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.5A2.25 2.25 0 006.75 21.75h10.5A2.25 2.25 0 0019.5 19.5V9.75" />
        </svg>
    ),
    tenants: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    ),
    assistants: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    ),
    receipts: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    ),
    renewals: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    maintenance: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-5.384a1.5 1.5 0 010-2.122l.354-.354a1.5 1.5 0 012.122 0l5.384 5.384m0 0L16.5 19.5l3.75-3.75-4.604-4.604m-4.226 4.024L19.5 6.75" />
        </svg>
    ),
    website: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    ),
    legal: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    ),
    billing: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    ),
    settings: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};

function SidebarLink({ href, active, icon, children, onClick, method, as }) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            onClick={onClick}
            className={
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ' +
                (active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white')
            }
        >
            <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
            {children}
        </Link>
    );
}

function notificationTone(type) {
    if (type === 'expired') return 'bg-rose-100 text-rose-700';
    if (type === 'renewal') return 'bg-amber-100 text-amber-700';
    return 'bg-indigo-100 text-indigo-700';
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, notifications = [] } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const canManageProperties = ['super_admin', 'landlord', 'assistant', 'agent'].includes(user.role);
    const canManageAssistants = ['super_admin', 'landlord'].includes(user.role);
    const isSuperAdmin = user.role === 'super_admin';

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="bg-purple-100 text-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Super Admin</span>;
            case 'landlord':
                return <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Landlord</span>;
            case 'assistant':
                return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Assistant</span>;
            case 'agent':
                return <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Agent</span>;
            case 'tenant':
                return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Tenant</span>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const onClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const closeSidebar = () => setSidebarOpen(false);

    const nav = (
        <>
            <div className="px-4 py-5 border-b border-white/10">
                <Link href={route('dashboard')} onClick={closeSidebar} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                        E
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-base tracking-tight text-white leading-none">E-Landlord</span>
                        <span className="text-[10px] text-indigo-300 font-medium tracking-wider uppercase mt-1">Property Hub</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Menu</p>
                <SidebarLink href={route('dashboard')} active={route().current('dashboard')} icon={icons.dashboard} onClick={closeSidebar}>
                    Dashboard
                </SidebarLink>
                {canManageProperties && (
                    <SidebarLink href={route('properties.index')} active={route().current('properties.*')} icon={icons.properties} onClick={closeSidebar}>
                        Properties
                    </SidebarLink>
                )}
                {canManageProperties && (
                    <SidebarLink href={route('tenants.index')} active={route().current('tenants.*')} icon={icons.tenants} onClick={closeSidebar}>
                        Tenants & History
                    </SidebarLink>
                )}
                {canManageAssistants && (
                    <SidebarLink href={route('assistants.index')} active={route().current('assistants.*')} icon={icons.assistants} onClick={closeSidebar}>
                        Assistants
                    </SidebarLink>
                )}
                <SidebarLink href={route('receipts.index')} active={route().current('receipts.*')} icon={icons.receipts} onClick={closeSidebar}>
                    Payment Receipts
                </SidebarLink>
                <SidebarLink href={route('renewals.index')} active={route().current('renewals.*')} icon={icons.renewals} onClick={closeSidebar}>
                    Renewal Alerts
                </SidebarLink>
                <SidebarLink href={route('maintenance.index')} active={route().current('maintenance.*')} icon={icons.maintenance} onClick={closeSidebar}>
                    Maintenance
                </SidebarLink>
                {user.role === 'landlord' && (
                    <SidebarLink href={route('billing.index')} active={route().current('billing.index')} icon={icons.billing} onClick={closeSidebar}>
                        Subscription
                    </SidebarLink>
                )}
                {isSuperAdmin && (
                    <SidebarLink href={route('billing.settings')} active={route().current('billing.settings')} icon={icons.billing} onClick={closeSidebar}>
                        Billing
                    </SidebarLink>
                )}
                {isSuperAdmin && (
                    <SidebarLink href={route('legal-pages.index')} active={route().current('legal-pages.*')} icon={icons.legal} onClick={closeSidebar}>
                        Legal Pages
                    </SidebarLink>
                )}
                {canManageAssistants && (
                    <SidebarLink href={route('settings.listing')} active={route().current('settings.*')} icon={icons.settings} onClick={closeSidebar}>
                        Listing Settings
                    </SidebarLink>
                )}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <SidebarLink href="/" icon={icons.website} onClick={closeSidebar}>
                    Public Website
                </SidebarLink>
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/60 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={
                    'fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white flex flex-col shadow-xl transition-transform duration-200 lg:translate-x-0 ' +
                    (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                }
            >
                {nav}
            </aside>

            <div className="lg:pl-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                aria-label="Open menu"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    Welcome back, {user.name.split(' ')[0]}
                                </p>
                                <p className="text-[11px] text-slate-400 hidden sm:block">Manage your properties from one place</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden md:block">{getRoleBadge(user.role)}</div>

                            <div className="relative" ref={notificationRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowNotifications((open) => !open)}
                                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                                    aria-label="Notifications"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[1.15rem] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                                            {notifications.length > 9 ? '9+' : notifications.length}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden z-50">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                {notifications.length} new
                                            </span>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-10 text-center">
                                                <p className="text-sm font-medium text-slate-700">You're all caught up</p>
                                                <p className="text-xs text-slate-400 mt-1">No renewal or maintenance alerts right now.</p>
                                            </div>
                                        ) : (
                                            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                                                {notifications.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={item.href}
                                                        onClick={() => setShowNotifications(false)}
                                                        className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition"
                                                    >
                                                        <span className={`mt-0.5 h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${notificationTone(item.type)}`}>
                                                            {item.type === 'maintenance' ? 'M' : 'R'}
                                                        </span>
                                                        <span className="min-w-0">
                                                            <span className="block text-sm font-semibold text-slate-800">{item.title}</span>
                                                            <span className="block text-xs text-slate-500 truncate">{item.body}</span>
                                                            <span className="block text-[11px] text-slate-400 mt-0.5">{item.meta}</span>
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:inline max-w-[8rem] truncate">{user.name}</span>
                                        <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100">
                                        Signed in as <strong className="text-slate-800">{user.email}</strong>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {flash?.success && (
                    <div className="bg-emerald-600 text-white text-sm py-2.5 px-4 text-center font-medium shadow-sm flex justify-center items-center gap-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-600 text-white text-sm py-2.5 px-4 text-center font-medium shadow-sm">
                        {flash.error}
                    </div>
                )}

                {header && (
                    <div className="bg-white border-b border-slate-200">
                        <div className="px-4 py-5 sm:px-6 lg:px-8">{header}</div>
                    </div>
                )}

                <main className="flex-1 py-8">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
