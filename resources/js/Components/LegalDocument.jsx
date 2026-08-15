import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function LegalDocument({ title, description, updated, html, children }) {
    return (
        <MainLayout>
            <Head title={`${title} - E-Landlord`}>
                <meta head-key="description" name="description" content={description} />
            </Head>

            <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">
                        Legal
                    </span>
                    <h1 className="text-4xl font-extrabold mt-4 sm:text-5xl">{title}</h1>
                    <p className="mt-4 text-slate-300 text-sm font-light">Last updated {updated}</p>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm leading-relaxed text-slate-600
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-3
                [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-indigo-600 [&_a]:font-semibold [&_a]:hover:underline
                [&_strong]:text-slate-800">
                {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : children}
            </article>
        </MainLayout>
    );
}
