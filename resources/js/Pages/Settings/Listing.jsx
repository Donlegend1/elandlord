import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ListingSettings({ settings, inquiries = [] }) {
    const { flash } = usePage().props;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        phone: settings.phone || '',
        public_contact_display: settings.public_contact_display || 'both',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('settings.listing.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Listing Settings</h2>
                    <p className="text-sm text-slate-500">Control which phone numbers visitors see on your public property pages.</p>
                </div>
            }
        >
            <Head title="Listing Settings" />

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                {(flash?.success || recentlySuccessful) && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium px-4 py-3 rounded-xl">
                        {flash?.success || 'Listing contact settings saved.'}
                    </div>
                )}

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Your phone number</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Shown when you choose to publish your number"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                        <p className="text-xs text-slate-500 mt-2">
                            Assigned assistants and agents also need a phone number on their account for their number to appear.
                        </p>
                    </div>

                    <div>
                        <p className="block text-xs font-semibold text-slate-700 uppercase mb-3">Public listing contacts</p>
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                                <input
                                    type="radio"
                                    name="public_contact_display"
                                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.public_contact_display === 'agent'}
                                    onChange={() => setData('public_contact_display', 'agent')}
                                />
                                <span>
                                    <span className="block font-bold text-slate-800 text-sm">Agent number only</span>
                                    <span className="block text-xs text-slate-500 mt-0.5">
                                        Visitors see the assigned agent or assistant phone. Your number stays private.
                                    </span>
                                </span>
                            </label>
                            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                                <input
                                    type="radio"
                                    name="public_contact_display"
                                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.public_contact_display === 'both'}
                                    onChange={() => setData('public_contact_display', 'both')}
                                />
                                <span>
                                    <span className="block font-bold text-slate-800 text-sm">My number and the agent number</span>
                                    <span className="block text-xs text-slate-500 mt-0.5">
                                        Visitors can call you and the assigned agent or assistant.
                                    </span>
                                </span>
                            </label>
                        </div>
                        {errors.public_contact_display && <p className="text-xs text-rose-500 mt-2">{errors.public_contact_display}</p>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition"
                    >
                        {processing ? 'Saving…' : 'Save settings'}
                    </button>
                </div>
            </form>

            <div className="max-w-2xl mt-10">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Recent listing inquiries</h3>
                {inquiries.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl p-6">
                        Messages sent from public property pages will appear here.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{inquiry.name}</div>
                                        <div className="text-xs text-slate-500">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ''}</div>
                                    </div>
                                    <div className="text-[11px] text-slate-400 whitespace-nowrap">{inquiry.created_at}</div>
                                </div>
                                <div className="text-xs font-semibold text-indigo-600 mt-2">{inquiry.property_name}</div>
                                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{inquiry.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
