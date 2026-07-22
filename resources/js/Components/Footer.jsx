import { Link } from "@inertiajs/react";

export default function Footer() {
  return (
    <footer className='bg-black text-slate-200 mt-24'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4'>
        <div>
          <span className='font-serif text-xl font-bold tracking-wider text-white uppercase'>
            Marete &amp; Co Realty
          </span>
          <p className='mt-4 text-sm text-slate-300 leading-relaxed'>
            Discover Kenya's finest addresses. Premium property sales, luxury
            rentals, prime land acquisitions, and off-plan investments in
            Nairobi and beyond.
          </p>
        </div>

        <div>
          <h3 className='font-semibold text-sm uppercase tracking-wider text-white'>
            Quick Links
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-300'>
            <li>
              <Link href='/' className='hover:text-white transition-colors'>
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='hover:text-white transition-colors'
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href='/products'
                className='hover:text-white transition-colors'
              >
                Property Listings
              </Link>
            </li>
            <li>
              <Link href='/faq' className='hover:text-white transition-colors'>
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-semibold text-sm uppercase tracking-wider text-white'>
            Property Categories
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-300'>
            <li>
              <Link
                href='/products?category=sale'
                className='hover:text-white transition-colors'
              >
                Luxury Homes for Sale
              </Link>
            </li>
            <li>
              <Link
                href='/products?category=rental'
                className='hover:text-white transition-colors'
              >
                Premium Rentals
              </Link>
            </li>
            <li>
              <Link
                href='/products?category=land'
                className='hover:text-white transition-colors'
              >
                Prime Land Plots
              </Link>
            </li>
            <li>
              <Link
                href='/products?category=off-plan'
                className='hover:text-white transition-colors'
              >
                Off-Plan Developments
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-semibold text-sm uppercase tracking-wider text-white'>
            Contact Us
          </h3>
          <ul className='mt-4 space-y-2 text-sm text-slate-300'>
            <li className='flex items-center gap-2'>
              <span>📍</span> Nairobi, Kenya
            </li>
            <li className='flex items-center gap-2'>
              <span>📞</span> +254 746 242 233
            </li>
            <li className='flex items-center gap-2'>
              <span>✉️</span> Mareteco9@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-maroon-900/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-400'>
          <span>
            © {new Date().getFullYear()} Marete &amp; Co Realty. All rights
            reserved.
          </span>
          <div className='flex gap-4'>
            <Link href='/login' className='hover:underline hover:text-white'>
              Agent Portal
            </Link>
            <span>•</span>
            <a href='#' className='hover:underline hover:text-white'>
              Privacy Policy
            </a>
            <span>•</span>
            <a href='#' className='hover:underline hover:text-white'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
