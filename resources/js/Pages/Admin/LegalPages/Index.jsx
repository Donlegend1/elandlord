import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pages }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Legal Pages</h2>
                    <p className="text-sm text-slate-500">Update the public Terms of Service and Privacy Policy. Changes go live immediately.</p>
                </div>
            }
        >
            <Head title="Legal Pages" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                {pages.map((page) => (
                    <div key={page.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                /{page.slug}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-3">{page.title}</h3>
                            <p className="text-sm text-slate-500 mt-2">{page.description}</p>
                            <p className="text-xs text-slate-400 mt-3">
                                Last updated {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : '—'}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href={route('legal-pages.edit', page.id)}
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                            >
                                Edit page
                            </Link>
                            <a
                                href={page.public_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                            >
                                View public page
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
