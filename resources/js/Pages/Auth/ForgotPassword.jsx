import { useForm, Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - E-Landlord Property Hub" />

            <h2 className="text-2xl font-serif font-black text-slate-950 mb-2 text-center">
                Forgot Password?
            </h2>
            <p className="text-slate-500 text-sm text-center mb-6 font-light">
                No worries! Enter your registered email address and we'll send you a link to reset your password.
            </p>

            {status && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <InputLabel htmlFor="forgot-email" value="Email Address" />
                    <TextInput
                        id="forgot-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        isFocused={true}
                        autoComplete="username"
                        className="mt-1 block w-full"
                        placeholder="you@example.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Submit */}
                <PrimaryButton disabled={processing} className="w-full justify-center py-3.5">
                    {processing ? 'Sending…' : 'Send Reset Link'}
                </PrimaryButton>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-maroon-600 font-semibold hover:text-maroon-700 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                </Link>
            </div>
        </GuestLayout>
    );
}

