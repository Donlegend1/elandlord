import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Landlord / Owner',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset('message'),
        });
    };

    return (
        <MainLayout>
            <Head>
                <title>Contact Support - E-Landlord</title>
                <meta name="description" content="Get in touch with E-Landlord support team for property management inquiries." />
            </Head>

            <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider">Contact Us</span>
                    <h1 className="text-4xl font-extrabold mt-4 sm:text-5xl">We're Here to Help</h1>
                    <p className="mt-4 text-slate-300 text-lg font-light">Have questions about setting up your properties or managing tenant records? Drop us a message.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Support & Assistance</h3>
                            <p className="text-slate-600 text-sm">Our dedicated property support team responds within 24 hours.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="text-2xl">✉️</div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Email Support</div>
                                    <div className="text-xs text-slate-500 mt-0.5">support@elandlord.com</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="text-2xl">📞</div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Phone Line</div>
                                    <div className="text-xs text-slate-500 mt-0.5">+1 (800) 555-LANDLORD</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="text-2xl">🏢</div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Global Headquarters</div>
                                    <div className="text-xs text-slate-500 mt-0.5">Springfield Tech Park, IL 62701</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                        {flash?.success ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 font-bold">✓</div>
                                <h4 className="text-xl font-bold text-slate-900">Message Sent!</h4>
                                <p className="text-xs text-slate-500 mt-2">{flash.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Send a Message</h3>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="w-full rounded-xl border-slate-300 text-sm"
                                        placeholder="Alexander Sterling"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        className="w-full rounded-xl border-slate-300 text-sm"
                                        placeholder="landlord@example.com"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">I am a</label>
                                    <select
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 text-sm"
                                    >
                                        <option>Landlord / Owner</option>
                                        <option>Assistant</option>
                                        <option>Tenant</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        className="w-full rounded-xl border-slate-300 text-sm"
                                        placeholder="How can we assist you?"
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-rose-600">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md disabled:opacity-60"
                                >
                                    {processing ? 'Sending…' : 'Submit Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
