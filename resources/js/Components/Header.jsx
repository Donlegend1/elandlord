import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const propertyCategories = [
  { href: "/products?category=sale", label: "Properties For Sale" },
  { href: "/products?category=rental", label: "Luxury Rentals" },
  { href: "/products?category=land", label: "Prime Land Plots" },
  { href: "/products?category=off-plan", label: "Off-Plan Projects" },
];

export default function Header() {
  const { auth } = usePage().props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className='fixed top-0 left-0 right-0 z-50'>
      {/* ── Top premium info bar ── */}
      <div className='bg-black text-slate-100 text-xs py-2.5 border-b border-maroon-900/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2'>
          <div className='flex flex-wrap gap-6'>
            <span className='flex items-center gap-1.5 hover:text-white transition-colors'>
              <svg
                className='w-3.5 h-3.5 text-slate-300'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              Mareteco9@gmail.com
            </span>
            <span className='flex items-center gap-1.5 hover:text-white transition-colors'>
              <svg
                className='w-3.5 h-3.5 text-slate-300'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
              +254 746 242233
            </span>
            <span className='flex items-center gap-1.5 hover:text-white transition-colors hidden sm:flex'>
              <svg
                className='w-3.5 h-3.5 text-slate-300'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              Nairobi, Kenya
            </span>
          </div>
          <div className='flex items-center gap-3'>
            {auth?.user ? (
              <div className='flex items-center gap-3'>
                <Link
                  href='/admin/dashboard'
                  className='hover:text-white font-semibold transition-colors'
                >
                  Admin Dashboard
                </Link>
                <span>|</span>
                <Link
                  href='/logout'
                  method='post'
                  as='button'
                  className='hover:text-white transition-colors'
                >
                  Log Out
                </Link>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                {/* <Link href="/login" className="hover:text-white transition-colors">Client Portal</Link> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav className='bg-maroon-500 backdrop-blur-md shadow-md border-b border-maroon-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2 shrink-0'>
              <span className='text-xl md:text-2xl font-serif font-black tracking-wider text-white uppercase'>
                Marete &amp; Co{" "}
                <span className='text-slate-300 font-sans font-light text-base lowercase tracking-normal'>
                  realty
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className='hidden lg:flex items-center gap-1'>
              <Link
                href='/'
                className='px-3 py-2 text-slate-100 hover:text-white font-medium text-sm transition-colors'
              >
                Home
              </Link>
              <Link
                href='/about'
                className='px-3 py-2 text-slate-100 hover:text-white font-medium text-sm transition-colors'
              >
                About Us
              </Link>

              {/* Categories dropdown */}
              <div
                className='relative'
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className='flex items-center gap-1 px-3 py-2 text-slate-100 hover:text-white font-medium text-sm transition-colors'>
                  Properties
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className='absolute top-full left-0 w-52 bg-white shadow-xl rounded-lg border border-slate-100 py-1 z-50 animate-fade-in'>
                    {propertyCategories.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className='block px-4 py-2.5 text-sm text-slate-700 hover:bg-maroon-50 hover:text-maroon-900 transition-colors'
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className='border-t border-slate-100 my-1'></div>
                    <Link
                      href='/products'
                      className='block px-4 py-2.5 text-sm font-semibold text-maroon-900 hover:bg-maroon-50 transition-colors'
                    >
                      View All Listings
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href='/faq'
                className='px-3 py-2 text-slate-100 hover:text-white font-medium text-sm transition-colors'
              >
                FAQ
              </Link>
              <Link
                href='/contact'
                className='ml-3 px-6 py-2.5 bg-white hover:bg-slate-100 text-maroon-900 font-medium text-sm tracking-wide rounded-md transition-all duration-200 shadow hover:shadow-lg'
              >
                Inquire / Contact
              </Link>
              <Link
                href='/login'
                className='ml-3 px-6 py-2.5 bg-white hover:bg-slate-100 text-maroon-900 font-medium text-sm tracking-wide rounded-md transition-all duration-200 shadow hover:shadow-lg'
              >
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className='lg:hidden p-2 rounded-md text-slate-100 hover:bg-maroon-800'
              onClick={() => setMobileOpen((v) => !v)}
              aria-label='Toggle menu'
            >
              {mobileOpen ? (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className='lg:hidden border-t border-maroon-800 bg-maroon-950 px-4 py-4 space-y-1 shadow-inner'>
            <Link
              href='/'
              onClick={() => setMobileOpen(false)}
              className='block px-3 py-2.5 text-slate-100 hover:text-white font-medium rounded-lg hover:bg-maroon-900 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/about'
              onClick={() => setMobileOpen(false)}
              className='block px-3 py-2.5 text-slate-100 hover:text-white font-medium rounded-lg hover:bg-maroon-900 transition-colors'
            >
              About Us
            </Link>
            <div className='px-3 py-1 text-xs font-semibold text-slate-300 uppercase tracking-widest mt-2'>
              Properties
            </div>
            {propertyCategories.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className='block px-6 py-2 text-slate-100 hover:text-white text-sm rounded-lg hover:bg-maroon-900 transition-colors'
              >
                {item.label}
              </Link>
            ))}
            <Link
              href='/products'
              onClick={() => setMobileOpen(false)}
              className='block px-6 py-2 font-semibold text-white text-sm rounded-lg hover:bg-maroon-900 transition-colors'
            >
              View All Listings
            </Link>
            <Link
              href='/faq'
              onClick={() => setMobileOpen(false)}
              className='block px-3 py-2.5 text-slate-100 hover:text-white font-medium rounded-lg hover:bg-maroon-900 transition-colors'
            >
              FAQ
            </Link>
            <Link
              href='/contact'
              onClick={() => setMobileOpen(false)}
              className='block mt-4 px-5 py-3 bg-white hover:bg-slate-100 text-maroon-950 font-semibold rounded-lg text-center transition-colors shadow'
            >
              Inquire / Contact
            </Link>
            <Link
              href='/login'
              onClick={() => setMobileOpen(false)}
              className='block mt-4 px-5 py-3 bg-white hover:bg-slate-100 text-maroon-950 font-semibold rounded-lg text-center transition-colors shadow'
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
