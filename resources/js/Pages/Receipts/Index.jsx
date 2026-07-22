import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ReceiptsIndex({ receipts, activeLeases }) {
    const user = usePage().props.auth.user;
    const [showRecordModal, setShowRecordModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        lease_id: activeLeases[0]?.id || '',
        amount: activeLeases[0]?.rent_amount || '',
        payment_date: new Date().toISOString().split('T')[0],
        period_covered: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        payment_method: 'bank_transfer',
        transaction_reference: '',
        notes: '',
    });

    const handleLeaseSelect = (leaseId) => {
        const lease = activeLeases.find(l => l.id == leaseId);
        setData({
            ...data,
            lease_id: leaseId,
            amount: lease?.rent_amount || '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('receipts.store'), {
            onSuccess: () => {
                setShowRecordModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Digital Payment Receipts</h2>
                        <p className="text-sm text-slate-500">Generate, view, and print official digital rent receipts.</p>
                    </div>
                    {(['super_admin', 'landlord', 'assistant'].includes(user.role)) && (
                        <button
                            onClick={() => setShowRecordModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
                        >
                            + Record Payment & Issue Receipt
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Payment Receipts" />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Receipt Archives</h3>
                    <span className="text-xs bg-slate-100 font-semibold px-3 py-1 rounded-full text-slate-600">Total: {receipts.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                                <th className="py-3.5 px-6">Receipt #</th>
                                <th className="py-3.5 px-6">Tenant Name</th>
                                <th className="py-3.5 px-6">Property / Unit</th>
                                <th className="py-3.5 px-6">Period Covered</th>
                                <th className="py-3.5 px-6">Amount</th>
                                <th className="py-3.5 px-6">Payment Method</th>
                                <th className="py-3.5 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {receipts.map((rec) => (
                                <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">#{rec.receipt_number}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800">{rec.tenant?.name}</td>
                                    <td className="py-4 px-6 text-slate-600">
                                        <div>{rec.property?.name}</div>
                                        <div className="text-xs text-slate-400">Unit: {rec.unit?.unit_number}</div>
                                    </td>
                                    <td className="py-4 px-6 text-xs text-slate-600">{rec.period_covered}</td>
                                    <td className="py-4 px-6 font-extrabold text-emerald-600">${Number(rec.amount).toLocaleString()}</td>
                                    <td className="py-4 px-6 capitalize text-xs text-slate-500">{rec.payment_method.replace('_', ' ')}</td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            href={route('receipts.show', rec.id)}
                                            className="inline-block bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                                        >
                                            📄 Printable Receipt
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Record Payment */}
            {showRecordModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Record Rent Payment & Issue Receipt</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Tenant Lease</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.lease_id}
                                    onChange={e => handleLeaseSelect(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Tenant / Lease --</option>
                                    {activeLeases.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.tenant?.name} - {l.property?.name} ({l.unit?.unit_number})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.payment_date}
                                        onChange={e => setData('payment_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Period Covered</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="July 2026"
                                        value={data.period_covered}
                                        onChange={e => setData('period_covered', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment Method</label>
                                    <select
                                        className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                    >
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="cash">Cash</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="online_card">Online Card</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Transaction Ref # (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="TRX-123456"
                                    value={data.transaction_reference}
                                    onChange={e => setData('transaction_reference', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowRecordModal(false)}
                                    className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-emerald-700 shadow-md"
                                >
                                    {processing ? 'Generating Receipt...' : 'Generate Official Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
