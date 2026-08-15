import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

const faqs = [
    {
        q: 'What is E-Landlord?',
        a: 'E-Landlord is a complete digital property management system. It enables landlords to register properties, manage units, assign assistants to specific properties, issue official digital receipts, view tenant property history, and receive renewal alerts.',
    },
    {
        q: 'Who can create an account?',
        a: 'Public registration is for landlords and property owners only. After you register you must verify your email before opening the dashboard. Assistants and tenants cannot self-register — a landlord invites them, then they sign in from the login page.',
    },
    {
        q: 'How does the Assistant role work?',
        a: 'A Landlord or Owner can create Assistant accounts and assign specific properties to each assistant. Assistants log in to view and manage assigned properties, record rent payments, and issue receipts.',
    },
    {
        q: 'Can tenants view their rental payment receipts online?',
        a: 'Yes! Tenants have a dedicated portal to view current and past lease details, download printable digital receipts, view lease renewal alerts, and submit repair tickets.',
    },
    {
        q: 'How are Lease Renewal Alerts triggered?',
        a: 'E-Landlord automatically tracks lease end dates and highlights contracts expiring within 30 or 60 days on the renewal dashboard for instant 1-click extension.',
    },
    {
        q: 'Can digital receipts be printed or saved as PDF?',
        a: 'Yes, every digital receipt generated has an official printable layout formatted specifically for standard paper printing or PDF export.',
    },
];

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <MainLayout>
            <Head>
                <title>FAQ - Frequently Asked Questions - E-Landlord</title>
                <meta name="description" content="Answers about landlord-only registration, email verification, assistant invitations, digital receipts, and lease renewal alerts." />
            </Head>

            <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">Got Questions?</span>
                    <h1 className="text-4xl font-extrabold mt-4 sm:text-5xl">Frequently Asked Questions</h1>
                    <p className="mt-4 text-slate-300 text-lg font-light">Everything you need to know about E-Landlord features and user roles.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full p-6 text-left font-bold text-slate-900 flex justify-between items-center text-base hover:bg-slate-50 transition"
                            >
                                <span>{faq.q}</span>
                                <span className="text-xl text-indigo-600 font-extrabold">{openIdx === idx ? '−' : '+'}</span>
                            </button>
                            {openIdx === idx && (
                                <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
