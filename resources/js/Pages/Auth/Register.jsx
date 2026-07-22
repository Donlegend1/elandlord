import { useForm, Head, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'landlord',
        password: '',
        password_confirmation: '',
        terms: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register Account - E Landlord" />

            <div className="min-h-screen flex">
                {/* Left Panel */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center text-white p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
                >
                    <div className="relative z-10 max-w-md text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-4xl shadow-xl">
                                E
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-white uppercase">
                            E-Landlord <span className="text-indigo-400 font-normal text-lg lowercase tracking-normal">Property Hub</span>
                        </h1>
                        <p className="text-indigo-200 text-base mb-8 font-light">
                            Digital property management for landlords, assistants, agents, and tenants.
                        </p>

                        <ul className="text-left space-y-4 text-sm text-indigo-100">
                            {[
                                '🏢 Register & manage properties & units',
                                '👥 Assign assistants to manage specific properties',
                                '📄 Issue official printable digital receipts',
                                '⏰ Automated lease renewal reminders',
                                '🔧 Track maintenance requests & tenant property history',
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
                    <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Your Account</h2>
                        <p className="text-slate-500 mb-6 text-sm font-light">Sign up to access the E-Landlord portal.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Account Role Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Account Role</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
                                >
                                    <option value="landlord">Landlord / Property Owner</option>
                                    <option value="agent">Realty Agent</option>
                                    <option value="tenant">Tenant</option>
                                </select>
                            </div>

                            {/* Full Name */}
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

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            {/* Password & Confirm */}
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                            >
                                {processing ? 'Registering Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-slate-500">
                            Already registered?{' '}
                            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
