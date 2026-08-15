import { Link } from "@inertiajs/react";

export default function Footer() {
  return (
    <footer className='bg-slate-950 text-slate-300 mt-20 border-t border-slate-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4'>
        <div>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl'>
              E
            </div>
            <span className='font-black text-lg tracking-tight text-white uppercase'>
              E-LANDLORD
            </span>
          </div>
          <p className='text-sm text-slate-400 leading-relaxed'>
            The all-in-one digital property management platform. Built for landlords to automate listings, digital receipting, tenant history, and lease renewals — with assistant and tenant portals invited by the owner.
          </p>
        </div>

        <div>
          <h3 className='font-bold text-xs uppercase tracking-wider text-indigo-400'>
            Quick Navigation
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-400'>
            <li>
              <Link href='/' className='hover:text-white transition-colors'>Home</Link>
            </li>
            <li>
              <Link href='/listings' className='hover:text-white transition-colors'>Browse Properties</Link>
            </li>
            <li>
              <Link href='/about' className='hover:text-white transition-colors'>About & Features</Link>
            </li>
            <li>
              <Link href='/faq' className='hover:text-white transition-colors'>FAQ</Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-white transition-colors'>Contact Support</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-xs uppercase tracking-wider text-indigo-400'>
            Legal
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-400'>
            <li>
              <Link href='/terms' className='hover:text-white transition-colors'>Terms of Service</Link>
            </li>
            <li>
              <Link href='/privacy' className='hover:text-white transition-colors'>Privacy Policy</Link>
            </li>
            <li>
              <Link href='/register' className='hover:text-white transition-colors'>Register as Landlord</Link>
            </li>
            <li>
              <Link href='/login' className='hover:text-white transition-colors'>Sign In</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-xs uppercase tracking-wider text-indigo-400'>
            Contact E-Landlord
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-400'>
            <li className='flex items-center gap-2'>
              <span>📍</span> Springfield Global HQ
            </li>
            <li className='flex items-center gap-2'>
              <span>📞</span> +1 (800) 555-LANDLORD
            </li>
            <li className='flex items-center gap-2'>
              <span>✉️</span> support@elandlord.com
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-slate-900 bg-slate-950/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-500'>
          <span>
            © {new Date().getFullYear()} E-Landlord Property Hub. All rights reserved.
          </span>
          <div className='flex flex-wrap gap-4'>
            <Link href='/terms' className='hover:text-slate-300'>Terms</Link>
            <span>•</span>
            <Link href='/privacy' className='hover:text-slate-300'>Privacy</Link>
            <span>•</span>
            <Link href='/register' className='hover:text-slate-300'>Landlord Registration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
