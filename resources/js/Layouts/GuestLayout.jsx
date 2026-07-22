import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md flex flex-col items-center mb-6">
                <Link href="/" className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <ApplicationLogo className="w-10 h-10" />
                    </div>
                    <span className="text-xl font-serif font-black tracking-wider text-slate-900 uppercase mt-2">
                        Marete &amp; Co <span className="text-maroon-600 font-sans font-light text-base lowercase tracking-normal">realty</span>
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden bg-white px-8 py-8 shadow-xl border border-slate-100/80 rounded-2xl">
                {children}
            </div>
        </div>
    );
}

