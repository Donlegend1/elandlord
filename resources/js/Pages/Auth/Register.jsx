import { useForm, Head, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register Landlord Account - E-Landlord" />

            <div className="min-h-screen flex bg-slate-900">
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center text-white p-12 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-r border-slate-800">
                    <div className="relative z-10 max-w-md text-center">
                        <Link href="/" className="inline-block mb-6 group">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center font-black text-4xl shadow-xl group-hover:scale-105 transition-transform">
                                E
                            </div>
                        </Link>

                        <h1 className="text-3xl font-black mb-2 tracking-tight text-white uppercase">
                            E-Landlord <span className="text-indigo-400 font-normal text-lg lowercase tracking-normal">Property Hub</span>
                        </h1>
                        <p className="text-indigo-200 text-base mb-8 font-light leading-relaxed">
                            Public registration is for landlords and property owners only. We will email you a verification link before you can open the dashboard.
                        </p>

                        <div className="text-left space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xs text-xs text-indigo-100">
                            <div className="font-bold text-white uppercase text-xs tracking-wider mb-2">Landlord account includes</div>
                            <div className="flex items-center gap-2">Register and manage properties and units</div>
                            <div className="flex items-center gap-2">Invite assistants with scoped property access</div>
                            <div className="flex items-center gap-2">Add tenants and issue digital rent receipts</div>
                            <div className="flex items-center gap-2">Track lease expirations and renewal warnings</div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
                    <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
                        <div>
                            <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                                Landlord Registration
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 mt-2">Create your owner account</h2>
                            <p className="text-xs text-slate-500 mt-1 font-light">
                                Assistants and tenants cannot self-register. They are invited by a landlord, then sign in from the login page.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Alexander Sterling"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="landlord@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                                <p className="mt-1 text-[11px] text-slate-400">We will send a verification link to this address.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="+1 (555) 000-0000"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs text-slate-600 leading-relaxed">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-indigo-600 font-semibold hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-indigo-600 font-semibold hover:underline">
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>
                            {errors.terms && <p className="text-xs text-rose-600">{errors.terms}</p>}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm shadow-md disabled:opacity-60"
                            >
                                {processing ? 'Creating Account...' : 'Register Landlord Account'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 font-extrabold hover:underline">
                                Sign In to Portal
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
