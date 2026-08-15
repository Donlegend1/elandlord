import { Head, Link } from '@inertiajs/react';

export default function Authenticated({ children, header }) {
  return (
    <>
      <Head title={header || 'Admin'} />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header Navigation */}
        <header className="bg-slate-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap justify-between items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <span className="font-sans font-black tracking-widest text-lg uppercase text-white">E-LANDLORD</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 px-2 py-0.5 rounded text-white">Admin</span>
              </a>

            </div>
            
            <nav className="flex items-center gap-6 text-sm font-semibold tracking-wide">
              <Link href="/admin/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/admin/properties" className="text-slate-300 hover:text-white transition-colors">Manage Properties</Link>
              <Link href="/admin/messages" className="text-slate-300 hover:text-white transition-colors">Client Messages</Link>
              <Link href="/logout" method="post" as="button" className="text-slate-300 hover:text-white transition-colors">Log Out</Link>
              <Link href="/" className="text-maroon-500 hover:text-maroon-400 transition-colors">Public Website →</Link>
            </nav>
          </div>
        </header>

        {/* Content Section */}
        <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8 flex-1">
          {children}
        </main>
      </div>
    </>
  );
}

