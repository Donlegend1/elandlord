import { useForm, Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Client Portal Login - Marete & Co Realty" />

            <div className="min-h-screen flex">
                {/* Left Panel */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center text-white p-12"
                    style={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-950 opacity-85"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-md text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <a href="/">
                                <div className="w-20 h-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                                    <ApplicationLogo className="w-12 h-12 text-maroon-500" />
                                </div>
                            </a>
                        </div>

                        <h1 className="font-serif text-3xl font-black mb-3 tracking-wider text-white uppercase">
                            Marete &amp; Co <span className="text-maroon-500 font-sans font-light text-lg lowercase tracking-normal">realty</span>
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 font-light">
                            Your exclusive gateway to Nairobi's finest addresses and premier property portfolio.
                        </p>

                        <ul className="text-left space-y-4">
                            {[
                                '🔑 Exclusive access to luxury off-market listings',
                                '📍 Premium Nairobi enclaves (Karen, Runda, Muthaiga)',
                                '🤝 Dedicated private client advisory team',
                                '📈 Pre-vetted high-yield property developments',
                                '💼 Full-service asset and rental management',
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-200 text-base">
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm mb-3">
                                <ApplicationLogo className="w-10 h-10 text-maroon-500" />
                            </div>
                            <span className="text-xl font-serif font-black tracking-wider text-slate-900 uppercase">
                                Marete &amp; Co <span className="text-maroon-500 font-sans font-light text-sm lowercase tracking-normal">realty</span>
                            </span>
                        </div>

                        <h2 className="text-3xl font-serif font-black text-slate-950 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 mb-8 font-light">Sign in to your Marete &amp; Co client account</p>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition"
                                    placeholder="you@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                                    />
                                    <span className="text-sm text-slate-600">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-maroon-500 font-medium hover:text-maroon-600 transition"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-6 bg-maroon-500 hover:bg-maroon-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                            >
                                {processing ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

