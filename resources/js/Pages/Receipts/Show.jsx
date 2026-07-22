import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ReceiptsShow({ receipt }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between print:hidden">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Digital Rent Receipt</h2>
                        <p className="text-sm text-slate-500">Official proof of payment for property lease.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                        >
                            🖨️ Print / Save PDF Receipt
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Receipt #${receipt.receipt_number}`} />

            <div className="max-w-3xl mx-auto my-4 bg-white border-2 border-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl print:border-none print:shadow-none print:m-0 print:p-0">
                {/* Header Branding */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-slate-900 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl">
                            E
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">E-LANDLORD</h1>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Official Payment Receipt</p>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase">Receipt Number</div>
                        <div className="text-xl font-mono font-extrabold text-indigo-700">#{receipt.receipt_number}</div>
                        <div className="text-xs text-slate-500 mt-1">Date: <strong>{receipt.payment_date}</strong></div>
                    </div>
                </div>

                {/* Property & Landlord Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 text-sm">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Landlord / Owner</div>
                        <div className="font-bold text-slate-800 text-base">{receipt.property?.landlord?.name}</div>
                        <div className="text-xs text-slate-500">{receipt.property?.landlord?.email}</div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Received From (Tenant)</div>
                        <div className="font-bold text-slate-800 text-base">{receipt.tenant?.name}</div>
                        <div className="text-xs text-slate-500">{receipt.tenant?.email}</div>
                    </div>
                </div>

                {/* Property Unit Details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden my-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-white text-xs uppercase font-semibold">
                            <tr>
                                <th className="py-3 px-4">Property & Unit</th>
                                <th className="py-3 px-4">Period Covered</th>
                                <th className="py-3 px-4">Payment Method</th>
                                <th className="py-3 px-4 text-right">Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            <tr>
                                <td className="py-4 px-4 font-bold text-slate-800">
                                    {receipt.property?.name}
                                    <div className="text-xs font-medium text-slate-500">Unit: {receipt.unit?.unit_number}</div>
                                </td>
                                <td className="py-4 px-4 text-slate-700 font-medium">{receipt.period_covered}</td>
                                <td className="py-4 px-4 text-slate-600 capitalize">{receipt.payment_method.replace('_', ' ')}</td>
                                <td className="py-4 px-4 text-right font-black text-xl text-slate-900">
                                    ${Number(receipt.amount).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Sign Off & Stamp */}
                <div className="mt-12 pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Issued By Authorized Agent</div>
                        <div className="font-bold text-slate-800 mt-1">{receipt.created_by?.name}</div>
                        <div className="text-xs text-slate-500">{receipt.created_by?.email}</div>
                    </div>

                    <div className="text-center sm:text-right">
                        <div className="inline-block border-2 border-emerald-600 text-emerald-700 font-black text-xs px-4 py-2 rounded-lg uppercase tracking-widest rotate-[-3deg] shadow-xs">
                            ✓ PAID IN FULL
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                    This is an electronically generated receipt verified by E-Landlord Property Management System.
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
