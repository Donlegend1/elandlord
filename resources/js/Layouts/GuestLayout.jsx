import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-12">
            <div className="w-full max-w-md flex flex-col items-center mb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg group-hover:scale-105 transition-transform">
                        E
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white uppercase">
                        E-LANDLORD
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden bg-white px-8 py-8 shadow-2xl border border-slate-200 rounded-3xl">
                {children}
            </div>
        </div>
    );
}
