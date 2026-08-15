import { useForm, Head, Link } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const fillDemoAccount = (email, password = 'password') => {
        setData({
            email,
            password,
            remember: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In - E-Landlord Property Hub" />

            <div className="min-h-screen flex bg-slate-900">
                {/* Left Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center text-white p-12 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-r border-slate-800">
                    <div className="relative z-10 max-w-md text-center">
                        <Link href="/" className="inline-block mb-6 group">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center font-black text-4xl shadow-xl group-hover:scale-105 transition-transform">
                                E
                            </div>
                        </Link>

                        <h1 className="text-3xl font-black mb-2 tracking-tight uppercase text-white">
                            E-LANDLORD <span className="text-indigo-400 font-normal text-lg lowercase tracking-normal">Property Hub</span>
                        </h1>
                        <p className="text-indigo-200 text-base mb-8 font-light leading-relaxed">
                            Sign in to access your digital property management portal, tenant logs, receipts, and renewal alerts.
                        </p>

                        <div className="text-left space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xs text-xs text-indigo-100">
                            <div className="font-bold text-white uppercase text-xs tracking-wider mb-2">Platform Highlights</div>
                            <div className="flex items-center gap-2">🏢 Register Properties & Units</div>
                            <div className="flex items-center gap-2">👥 Delegate Property Access to Assistants</div>
                            <div className="flex items-center gap-2">📄 Issue Verifiable Digital Receipts (#EL-2026-XXXX)</div>
                            <div className="flex items-center gap-2">⏰ Automated 30/60-Day Renewal Alerts</div>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
                    <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900">Sign In to Portal</h2>
                                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">E-Landlord</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-light">Enter your account credentials to access your dashboard.</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="landlord@elandlord.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-indigo-600 font-semibold hover:underline"
                                        >
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs text-slate-600">Remember me on this browser</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Signing in…' : 'Sign In to Dashboard'}
                            </button>
                        </form>

                        {/* Quick Demo Fill Buttons */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                                Quick Demo Login Fill
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => fillDemoAccount('landlord@elandlord.com')}
                                    className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-center transition"
                                >
                                    🔑 Landlord
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoAccount('assistant@elandlord.com')}
                                    className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-center transition"
                                >
                                    🔑 Assistant
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoAccount('tenant@elandlord.com')}
                                    className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-center transition"
                                >
                                    🔑 Tenant
                                </button>
                            </div>
                        </div>

                        {/* Registration Link */}
                        <div className="pt-2 text-center border-t border-slate-100">
                            <p className="text-xs text-slate-500">
                                Don't have an account yet?{' '}
                                <Link href="/register" className="text-indigo-600 font-extrabold hover:underline">
                                    Register Landlord Account
                                </Link>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-2">
                                Assistants and tenants are invited by a landlord and cannot self-register.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
