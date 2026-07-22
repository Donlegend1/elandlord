import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Seo from '@/Components/Seo';

const faqs = [
    {
        question: 'Can foreigners buy property in Kenya?',
        answer:
            'Yes, foreigners can purchase land and buildings in Kenya. However, under the Constitution, foreigners can only hold leasehold land for a term of up to 99 years, not freehold agricultural land, unless special exemptions apply.',
    },
    {
        question: 'What is the property buying process in Kenya?',
        answer:
            'The process includes: 1) Selecting a property and signing an offer letter; 2) Performing an official search of the title deed; 3) Drafting and signing a Sale Agreement; 4) Paying the deposit (usually 10%-20%); 5) Paying stamp duty and registering the transfer of title under legal representation.',
    },
    {
        question: 'How much is stamp duty in Kenya?',
        answer:
            'Stamp duty is a tax paid to the government on property transfers. It is currently 4% of the property value for properties within municipalities/cities (like Nairobi) and 2% for properties in rural areas.',
    },
    {
        question: 'Do you manage rental properties on behalf of landlords?',
        answer:
            'Yes, Marete & Co Realty offers full-service property management. We handle tenant sourcing, vetting, rent collection, routine maintenance, and monthly financial reporting, giving landlords complete peace of mind.',
    },
    {
        question: 'What is an off-plan property investment?',
        answer:
            'Off-plan means purchasing a property before it is constructed, based on architectural designs and models. It offers lower pricing than completed projects and provides flexible payment plans over the construction period, yielding excellent capital gains.',
    },
    {
        question: 'What are the fees for listing a property with Marete & Co?',
        answer:
            'For property sales, we charge a standard commission of 3% of the final sales price. For rental listings, our agency fee is equal to one month\'s rent for tenant placement, or 10% of monthly rent for active ongoing property management services.',
    },
    {
        question: 'What is the difference between freehold and leasehold title deeds?',
        answer:
            'A freehold title deed gives the owner absolute ownership of the land for an indefinite period. A leasehold title deed grants ownership for a specified period (typically 99 years in urban centers like Nairobi), after which the lease can be renewed with the local government.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const baseUrl = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <MainLayout>
            <Seo
                title="FAQ - Real Estate Advice & Regulations"
                description="Frequently asked questions about buying, renting, and investing in property in Nairobi, Kenya. Understand stamp duty, freehold vs leasehold, and foreign ownership rules."
                path="/faq"
                schema={schema}
            />

            {/* Page Banner */}
            <div
                className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center -mt-20 overflow-hidden"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950 bg-opacity-65"></div>
                <div className="relative z-10 text-center px-4 pt-10">
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-wide">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm sm:text-base text-maroon-400 mb-4 font-light">
                        Guidance on property laws, buying processes, and management in Kenya
                    </p>
                    <nav className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                        <Link href="/" className="hover:text-maroon-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-maroon-500 font-medium">FAQ</span>
                    </nav>
                </div>
            </div>

            {/* Accordion Section */}
            <section className="bg-slate-50 py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
                                    aria-expanded={openIndex === idx}
                                >
                                    <span className="text-slate-800 font-bold text-sm sm:text-base pr-4">
                                        {faq.question}
                                    </span>
                                    <span className="text-maroon-600 flex-shrink-0 transition-transform duration-300">
                                        {openIndex === idx ? '▲' : '▼'}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <p className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-slate-900 py-16 px-4 text-center text-white relative">
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                        Our property consultants are ready to assist you. Contact us for direct guidance on any property listing or regulations in Kenya.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-maroon-600 hover:bg-maroon-500 text-white font-bold px-8 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors shadow"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}

