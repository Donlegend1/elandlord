import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Header() {
  const { auth } = usePage().props;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='fixed top-0 left-0 right-0 z-50'>
      {/* Top info bar */}
      <div className='bg-slate-950 text-slate-300 text-xs py-2 border-b border-slate-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <span className='flex items-center gap-1.5 hover:text-white transition-colors'>
              ✉️ support@elandlord.com
            </span>
            <span className='flex items-center gap-1.5 hover:text-white transition-colors hidden sm:flex'>
              📞 +1 (800) 555-LANDLORD
            </span>
          </div>
          <div className='flex items-center gap-3'>
            {auth?.user ? (
              <Link
                href='/dashboard'
                className='text-indigo-400 font-bold hover:text-indigo-300 transition-colors'
              >
                Go to Dashboard ({auth.user.name}) &rarr;
              </Link>
            ) : (
              <div className='flex items-center gap-3'>
                <Link href='/login' className='hover:text-white transition-colors'>
                  Sign In
                </Link>
                <span>|</span>
                <Link href='/register' className='text-indigo-400 font-semibold hover:text-indigo-300 transition-colors'>
                  Register Landlord
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className='bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-3 shrink-0'>
              <div className='w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md'>
                E
              </div>
              <div className='flex flex-col'>
                <span className='text-lg font-black tracking-tight text-white leading-none uppercase'>
                  E-LANDLORD
                </span>
                <span className='text-[10px] text-indigo-400 font-semibold tracking-widest uppercase'>
                  Digital Property Hub
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className='hidden lg:flex items-center gap-6'>
              <Link href='/' className='text-slate-300 hover:text-white font-medium text-sm transition-colors'>
                Home
              </Link>
              <Link href='/listings' className='text-slate-300 hover:text-white font-medium text-sm transition-colors'>
                Properties
              </Link>
              <Link href='/about' className='text-slate-300 hover:text-white font-medium text-sm transition-colors'>
                About & Features
              </Link>
              <Link href='/faq' className='text-slate-300 hover:text-white font-medium text-sm transition-colors'>
                FAQ
              </Link>
              <Link href='/contact' className='text-slate-300 hover:text-white font-medium text-sm transition-colors'>
                Contact Support
              </Link>

              {auth?.user ? (
                <Link
                  href='/dashboard'
                  className='ml-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow'
                >
                  My Dashboard
                </Link>
              ) : (
                <div className='flex items-center gap-3 ml-2'>
                  <Link
                    href='/login'
                    className='px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-sm rounded-xl transition'
                  >
                    Log In
                  </Link>
                  <Link
                    href='/register'
                    className='px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow'
                  >
                    Register as Landlord
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className='lg:hidden p-2 rounded-md text-slate-300 hover:bg-slate-800'
              onClick={() => setMobileOpen((v) => !v)}
              aria-label='Toggle menu'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className='lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-2'>
            <Link href='/' onClick={() => setMobileOpen(false)} className='block px-3 py-2 text-slate-300 hover:text-white font-medium text-sm'>
              Home
            </Link>
            <Link href='/listings' onClick={() => setMobileOpen(false)} className='block px-3 py-2 text-slate-300 hover:text-white font-medium text-sm'>
              Properties
            </Link>
            <Link href='/about' onClick={() => setMobileOpen(false)} className='block px-3 py-2 text-slate-300 hover:text-white font-medium text-sm'>
              About & Features
            </Link>
            <Link href='/faq' onClick={() => setMobileOpen(false)} className='block px-3 py-2 text-slate-300 hover:text-white font-medium text-sm'>
              FAQ
            </Link>
            <Link href='/contact' onClick={() => setMobileOpen(false)} className='block px-3 py-2 text-slate-300 hover:text-white font-medium text-sm'>
              Contact Support
            </Link>

            {auth?.user ? (
              <Link href='/dashboard' onClick={() => setMobileOpen(false)} className='block w-full text-center py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl mt-3'>
                Go to Dashboard
              </Link>
            ) : (
              <div className='pt-2 space-y-2'>
                <Link href='/login' onClick={() => setMobileOpen(false)} className='block w-full text-center py-2 border border-slate-700 text-slate-200 font-medium text-sm rounded-xl'>
                  Log In
                </Link>
                <Link href='/register' onClick={() => setMobileOpen(false)} className='block w-full text-center py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl'>
                  Register as Landlord
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
