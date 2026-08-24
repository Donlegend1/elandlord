import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatMoney } from '@/lib/money';
import { useState } from 'react';

export default function BillingIndex({ quota, plans, subscription, currency, paystack_configured }) {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const subscribe = (planId) => {
        setSelectedPlan(planId);
        router.post(route('billing.subscribe'), { plan_id: planId }, {
            onFinish: () => setSelectedPlan(null),
        });
    };

    const currentInterval = subscription?.plan?.interval || quota?.plan_interval;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Subscription</h2>
                    <p className="text-sm text-slate-500">Subscribe to add more units than the free plan allows.</p>
                </div>
            }
        >
            <Head title="Subscription" />

            <div className="max-w-6xl space-y-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                            {quota?.subscribed ? 'Subscribed' : 'Free plan'}
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                            {quota?.subscribed ? (quota.plan_name || 'Active subscription') : `${quota?.used ?? 0} / ${quota?.limit ?? 0} units used`}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {quota?.subscribed
                                ? 'You can add unlimited units while this subscription stays active.'
                                : `You can manage ${quota?.limit ?? 0} units for free. Subscribe to add more.`}
                        </p>
                    </div>
                    <Link href={route('properties.index')} className="text-sm font-semibold text-indigo-600 hover:underline">
                        Go to properties
                    </Link>
                </div>

                {!paystack_configured && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4">
                        Payments are not available yet. The super admin needs to connect Paystack.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrent = currentInterval === plan.interval && quota?.subscribed;
                        const highlighted = plan.interval === 'annually';

                        return (
                            <div
                                key={plan.id}
                                className={
                                    'rounded-3xl border p-6 flex flex-col ' +
                                    (highlighted ? 'border-indigo-600 bg-indigo-50/40 shadow-md' : 'border-slate-200 bg-white')
                                }
                            >
                                {highlighted && (
                                    <span className="self-start text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-full mb-3">
                                        Best value
                                    </span>
                                )}
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-extrabold text-slate-900">{formatMoney(plan.amount, currency)}</span>
                                    <span className="text-sm text-slate-500"> / {plan.period_label.toLowerCase()}</span>
                                </div>
                                <ul className="mt-5 space-y-2 text-sm text-slate-600 flex-1">
                                    {(plan.features || []).map((feature) => (
                                        <li key={feature} className="flex gap-2">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    disabled={!!selectedPlan || !paystack_configured || isCurrent}
                                    onClick={() => subscribe(plan.id)}
                                    className={
                                        'mt-6 w-full font-bold text-sm py-2.5 rounded-xl transition ' +
                                        (isCurrent
                                            ? 'bg-slate-100 text-slate-500'
                                            : 'bg-slate-900 hover:bg-indigo-600 text-white disabled:opacity-50')
                                    }
                                >
                                    {isCurrent ? 'Current plan' : selectedPlan === plan.id ? 'Redirecting…' : 'Subscribe'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
