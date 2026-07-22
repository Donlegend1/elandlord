import { useForm, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import Seo from "@/Components/Seo";

const contactInfo = [
  {
    icon: "Email",
    label: "Email Address",
    value: "Mareteco9@gmail.com",
    href: "mailto:Mareteco9@gmail.com",
  },
  {
    icon: "Phone",
    label: "Phone Number",
    value: "+254 746 242233",
    href: "tel:+254746242233",
  },
  {
    icon: "Chat",
    label: "WhatsApp Chat",
    value: "+254 746 242233",
    href: "https://wa.me/254746242233",
  },
  {
    icon: "Location",
    label: "Corporate Office",
    value: "Block B, Nairobi, Kenya",
    href: null,
  },
  {
    icon: "Clock",
    label: "Office Hours",
    value: "Mon - Fri: 8:00 AM - 5:30 PM EAT",
    href: null,
  },
];

const iconMap = {
  Email: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
      />
    </svg>
  ),
  Phone: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
      />
    </svg>
  ),
  Chat: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      />
    </svg>
  ),
  Location: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
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
  ),
  Clock: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  ),
};

export default function Contact() {
  const { data, setData, post, processing, errors, reset, wasSuccessful } =
    useForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/contact", {
      onSuccess: () => {
        reset();
        alert(
          "Thank you! Your message was submitted successfully. Our team will contact you shortly.",
        );
      },
    });
  };

  const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${baseUrl}/contact/#webpage`,
        "url": `${baseUrl}/contact`,
        "name": "Contact Us - Marete & Co Realty",
        "description": "Get in touch with Marete & Co Realty. Schedule private viewings of Karen and Runda villas, discuss property management contracts, or off-plan listings."
      },
      {
        "@type": "RealEstateAgent",
        "@id": `${baseUrl}/#realestateagent`,
        "name": "Marete & Co Realty",
        "url": baseUrl,
        "telephone": "+254 746 242 233",
        "email": "Mareteco9@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Block B",
          "addressLocality": "Nairobi",
          "addressCountry": "KE"
        }
      }
    ]
  };

  return (
    <MainLayout>
      <Seo
        title='Contact Our Consultants'
        description='Get in touch with Marete & Co Realty. Schedule private viewings of Karen and Runda villas, discuss property management contracts, or off-plan listings.'
        path='/contact'
        schema={schema}
      />

      {/* Page Banner */}
      <section
        className='relative flex items-center justify-center h-72 md:h-80 bg-center bg-cover -mt-20 overflow-hidden'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className='absolute inset-0 bg-slate-950 bg-opacity-65'></div>
        <div className='relative z-10 text-center px-4 pt-10'>
          <nav className='flex items-center justify-center gap-2 text-xs text-maroon-400 mb-3'>
            <Link href='/' className='hover:text-maroon-500 transition-colors'>
              Home
            </Link>
            <span className='text-slate-400'>/</span>
            <span className='text-white font-medium'>Contact</span>
          </nav>
          <h1 className='font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-wide'>
            Contact Us
          </h1>
          <p className='text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light'>
            Schedule a private listing tour or request guidance on land and
            off-plan assets in Nairobi.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className='bg-slate-50 py-20 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Left Column: Info */}
            <div>
              <h2 className='font-serif text-2xl sm:text-3xl font-bold text-slate-950 mb-3'>
                Speak With Our Experts
              </h2>
              <p className='text-slate-600 text-sm mb-8 leading-relaxed'>
                Whether you wish to list a luxury villa with us, inquire about a
                specific Karen estate, discuss lease terms for diplomatic
                housing, or obtain advisory on land subdivisions, our team
                offers unmatched, confidential advisory.
              </p>

              {/* Contact Info Cards */}
              <div className='space-y-4 mb-8'>
                {contactInfo.map((item) => {
                  const CardContent = (
                    <div className='flex items-start gap-4 bg-white rounded-xl shadow-sm border border-slate-100 p-4'>
                      <div className='flex-shrink-0 w-12 h-12 rounded-full bg-maroon-50 text-maroon-600 flex items-center justify-center'>
                        {iconMap[item.icon]}
                      </div>
                      <div>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5'>
                          {item.label}
                        </p>
                        <p className='text-slate-800 text-sm font-semibold'>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.icon}
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className='block hover:scale-[1.01] transition-transform duration-200'
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div key={item.icon}>{CardContent}</div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Form */}
            <div className='bg-white rounded-xl shadow-sm border border-slate-100 p-8'>
              <h2 className='font-serif text-xl font-bold text-slate-950 mb-6'>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-5' noValidate>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='contact-name'
                      className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5'
                    >
                      Full Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='contact-name'
                      type='text'
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder='e.g. John Doe'
                      required
                      className='w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500'
                    />
                    {errors.name && (
                      <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='contact-email'
                      className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5'
                    >
                      Email Address <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='contact-email'
                      type='email'
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder='e.g. john@domain.com'
                      required
                      className='w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='contact-phone'
                      className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5'
                    >
                      Phone Number
                    </label>
                    <input
                      id='contact-phone'
                      type='tel'
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder='e.g. +254 700 000 000'
                      className='w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500'
                    />
                    {errors.phone && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='contact-subject'
                      className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5'
                    >
                      Inquiry Reason <span className='text-red-500'>*</span>
                    </label>
                    <select
                      id='contact-subject'
                      value={data.subject}
                      onChange={(e) => setData("subject", e.target.value)}
                      required
                      className='w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 bg-white'
                    >
                      <option value='' disabled>
                        Select a topic
                      </option>
                      <option value='Buying Property'>Buying Property</option>
                      <option value='Renting Property'>Renting Property</option>
                      <option value='Land Acquisitions'>
                        Land Acquisitions
                      </option>
                      <option value='Off-Plan Advisory'>
                        Off-Plan Advisory
                      </option>
                      <option value='Property Management Services'>
                        Property Management Services
                      </option>
                      <option value='General Enquiry'>General Enquiry</option>
                    </select>
                    {errors.subject && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='contact-message'
                    className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5'
                  >
                    Message <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    id='contact-message'
                    rows={5}
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    placeholder='Describe the property type or service you are interested in...'
                    required
                    className='w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 resize-none'
                  />
                  {errors.message && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={processing}
                  className='w-full bg-slate-900 hover:bg-maroon-600 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider shadow'
                >
                  {processing ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Area */}
      <div className='h-64 bg-slate-950 flex flex-col items-center justify-center text-white relative'>
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80'
            alt='Nairobi map style background'
            loading='lazy'
            className='w-full h-full object-cover opacity-20'
          />
        </div>
        <div className='relative z-10 text-center flex flex-col items-center'>
          <span className='text-3xl mb-2'>🏢</span>
          <h3 className='font-serif text-2xl font-bold mb-1 uppercase tracking-wider'>
            Our Nairobi Office
          </h3>
          <p className='text-slate-400 text-sm'>Nairobi, Kenya</p>
        </div>
      </div>
    </MainLayout>
  );
}
