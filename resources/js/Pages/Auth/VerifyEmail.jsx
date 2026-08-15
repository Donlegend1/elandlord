import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Your Email - E-Landlord" />

            <div className="mb-2">
                <span className="text-[11px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                    Email verification required
                </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-3">Check your inbox</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Thanks for creating your landlord account. Click the verification link we just emailed you before you can open the dashboard.
            </p>
            <p className="mt-2 text-sm text-slate-500">
                If you do not see it, check spam, then resend the email below.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-6 flex items-center justify-between gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Sending…' : 'Resend Verification Email'}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-slate-500 underline hover:text-slate-800"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
