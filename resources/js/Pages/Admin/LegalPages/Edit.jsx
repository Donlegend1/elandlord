import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ page }) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        description: page.description || '',
        content: page.content,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('legal-pages.update', page.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Edit {page.title}</h2>
                        <p className="text-sm text-slate-500">This content is shown on the public /{page.slug} page. Markdown is supported.</p>
                    </div>
                    <Link href={route('legal-pages.index')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        ← All legal pages
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${page.title}`} />

            <form onSubmit={submit} className="max-w-5xl space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Page title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-xl border-slate-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SEO description</label>
                        <input
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-xl border-slate-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Short summary used in search results"
                        />
                        {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Page content</label>
                        <p className="text-[11px] text-slate-400 mb-2">
                            Use Markdown: <code>## Heading</code>, lists with <code>-</code>, and links like <code>[Contact](/contact)</code>.
                        </p>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={22}
                            className="w-full rounded-xl border-slate-300 text-sm font-mono leading-relaxed focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.content && <p className="mt-1 text-xs text-rose-600">{errors.content}</p>}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm disabled:opacity-60"
                    >
                        {processing ? 'Saving…' : 'Save and publish'}
                    </button>
                    <a
                        href={page.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                    >
                        View live page
                    </a>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
