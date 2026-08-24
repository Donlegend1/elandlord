import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { formatMoney } from '@/lib/money';

export default function BillingSettings({ settings, plans, paystack_configured, subscriptions = [], payments = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        free_unit_limit: settings.free_unit_limit,
        listing_contact_fee: settings.listing_contact_fee,
        currency: settings.currency,
        plans: plans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            amount: plan.amount,
            description: plan.description || '',
            is_active: !!plan.is_active,
            interval: plan.interval,
        })),
    });

    const updatePlan = (index, field, value) => {
        const next = [...data.plans];
        next[index] = { ...next[index], [field]: value };
        setData('plans', next);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('billing.settings.update'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Billing & Subscriptions</h2>
                    <p className="text-sm text-slate-500">Set the free unit cap, listing contact fee, and Paystack subscription plans.</p>
                </div>
            }
        >
            <Head title="Billing settings" />

            <form onSubmit={submit} className="space-y-8 max-w-6xl">
                {!paystack_configured && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4">
                        Paystack keys are missing. Add <code className="font-mono">PAYSTACK_SECRET_KEY</code> and <code className="font-mono">PAYSTACK_PUBLIC_KEY</code> to <code className="font-mono">.env</code> so landlords and listing visitors can pay.
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-slate-800">Limits & listing contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Free unit limit</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full rounded-xl border-slate-200 text-sm"
                                value={data.free_unit_limit}
                                onChange={(e) => setData('free_unit_limit', e.target.value)}
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Landlords can add this many units without a subscription.</p>
                            {errors.free_unit_limit && <p className="text-xs text-rose-500 mt-1">{errors.free_unit_limit}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Listing contact fee</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-xl border-slate-200 text-sm"
                                value={data.listing_contact_fee}
                                onChange={(e) => setData('listing_contact_fee', e.target.value)}
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Visitors pay this to see phone and WhatsApp. Set 0 to show contacts for free.</p>
                            {errors.listing_contact_fee && <p className="text-xs text-rose-500 mt-1">{errors.listing_contact_fee}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Currency</label>
                            <select
                                className="w-full rounded-xl border-slate-200 text-sm"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                            >
                                <option value="NGN">NGN — Naira</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="GHS">GHS — Cedi</option>
                                <option value="ZAR">ZAR — Rand</option>
                                <option value="KES">KES — Kenyan Shilling</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {data.plans.map((plan, index) => (
                        <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 capitalize">{plan.interval === 'annually' ? 'Yearly' : plan.interval}</h3>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-indigo-600"
                                        checked={plan.is_active}
                                        onChange={(e) => updatePlan(index, 'is_active', e.target.checked)}
                                    />
                                    Active
                                </label>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500">Plan name</label>
                                <input
                                    className="w-full rounded-lg border-slate-200 text-sm mt-1"
                                    value={plan.name}
                                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500">Amount ({data.currency})</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-lg border-slate-200 text-sm mt-1"
                                    value={plan.amount}
                                    onChange={(e) => updatePlan(index, 'amount', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500">Card description</label>
                                <textarea
                                    rows="2"
                                    className="w-full rounded-lg border-slate-200 text-sm mt-1"
                                    value={plan.description}
                                    onChange={(e) => updatePlan(index, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md"
                    >
                        {processing ? 'Saving…' : 'Save billing settings'}
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mt-10">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Recent subscriptions</h3>
                    {subscriptions.length === 0 ? (
                        <p className="text-sm text-slate-500">No landlord subscriptions yet.</p>
                    ) : (
                        <div className="space-y-3 text-sm">
                            {subscriptions.map((item) => (
                                <div key={item.id} className="flex justify-between gap-3 border-b border-slate-50 pb-2">
                                    <div>
                                        <div className="font-semibold text-slate-800">{item.user?.name}</div>
                                        <div className="text-xs text-slate-500">{item.plan?.name || 'Plan'} · {item.status}</div>
                                    </div>
                                    <div className="text-xs text-slate-400">{item.next_payment_at ? new Date(item.next_payment_at).toLocaleDateString() : ''}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Recent payments</h3>
                    {payments.length === 0 ? (
                        <p className="text-sm text-slate-500">No Paystack payments recorded yet.</p>
                    ) : (
                        <div className="space-y-3 text-sm">
                            {payments.map((item) => (
                                <div key={item.id} className="flex justify-between gap-3 border-b border-slate-50 pb-2">
                                    <div>
                                        <div className="font-semibold text-slate-800">{item.email}</div>
                                        <div className="text-xs text-slate-500 capitalize">{item.type.replace('_', ' ')} · {item.status}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-700">{formatMoney(item.amount, item.currency)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
