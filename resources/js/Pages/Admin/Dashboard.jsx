import { Head, Link } from '@inertiajs/react';
import Authenticated from './Layouts/Authenticated';

export default function Dashboard({ stats }) {
  const statItems = [
    { label: 'Total Listings', value: stats.totalProperties, icon: '🏠', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'For Sale & Land', value: stats.saleCount, icon: '🏷️', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Luxury Rentals', value: stats.rentCount, icon: '🔑', color: 'bg-maroon-50 text-maroon-700' },
    { label: 'Off-Plan Projects', value: stats.offPlanCount, icon: '🏗️', color: 'bg-blue-50 text-blue-700' },
    { label: 'Client Inquiries', value: stats.totalMessages, icon: '✉️', color: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <Authenticated header="Admin Dashboard">
      <div className="space-y-10">
        
        {/* Header Title */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Overview of Marete & Co Realty portfolio status and customer requests.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.color}`}>Stat</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900">{item.value}</div>
                <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8">
          <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link 
              href="/admin/properties/create" 
              className="group p-6 bg-slate-900 hover:bg-maroon-600 text-white rounded-xl transition-all duration-300 flex flex-col justify-between h-40 shadow-sm hover:shadow-lg"
            >
              <span className="text-3xl">➕</span>
              <div>
                <h4 className="font-bold text-base">Add Property</h4>
                <p className="text-slate-300 group-hover:text-white text-xs mt-1">Create a new real estate listing.</p>
              </div>
            </Link>

            <Link 
              href="/admin/properties" 
              className="group p-6 bg-white border border-slate-200 hover:border-maroon-500 text-slate-800 rounded-xl transition-all duration-300 flex flex-col justify-between h-40 shadow-sm"
            >
              <span className="text-3xl">📋</span>
              <div>
                <h4 className="font-bold text-base text-slate-950">Manage Listings</h4>
                <p className="text-slate-500 text-xs mt-1">View, edit, or delete current listings.</p>
              </div>
            </Link>

            <Link 
              href="/admin/messages" 
              className="group p-6 bg-white border border-slate-200 hover:border-maroon-500 text-slate-800 rounded-xl transition-all duration-300 flex flex-col justify-between h-40 shadow-sm"
            >
              <span className="text-3xl">📬</span>
              <div>
                <h4 className="font-bold text-base text-slate-950">Read Inquiries</h4>
                <p className="text-slate-500 text-xs mt-1">View messages sent via inquiry forms.</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </Authenticated>
  );
}

