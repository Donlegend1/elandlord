import { Head, Link, router } from '@inertiajs/react';
import Authenticated from './Layouts/Authenticated';
import { useState } from 'react';

export default function Messages({ messages }) {
  const [activeMessage, setActiveMessage] = useState(null);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to permanently delete this customer inquiry?')) {
      router.delete(`/admin/messages/${id}`, {
        onSuccess: () => {
          alert('Message deleted successfully.');
          if (activeMessage && activeMessage.id === id) {
            setActiveMessage(null);
          }
        }
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Authenticated header="Client Inquiries">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Client Inquiries</h2>
          <p className="text-slate-500 text-sm mt-1">Review contact form and property inquiry submissions from potential clients.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isActive = activeMessage && activeMessage.id === msg.id;
                return (
                  <div 
                    key={msg.id} 
                    onClick={() => setActiveMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors text-left ${isActive ? 'bg-maroon-50/50 border-l-4 border-maroon-600' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{formatDate(msg.created_at)}</span>
                    </div>
                    <div className="text-xs text-maroon-650 font-bold mt-1 line-clamp-1">{msg.subject || 'No Subject'}</div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{msg.message}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No inquiries received yet.
              </div>
            )}
          </div>

          {/* Right Column: Message Detail View */}
          <div className="lg:col-span-2">
            {activeMessage ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8 space-y-6 text-left">
                
                {/* Header Metadata */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-950">{activeMessage.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                      <span>✉️ <a href={`mailto:${activeMessage.email}`} className="hover:underline font-semibold text-slate-700">{activeMessage.email}</a></span>
                      {activeMessage.phone && <span>📞 <a href={`tel:${activeMessage.phone}`} className="hover:underline font-semibold text-slate-700">{activeMessage.phone}</a></span>}
                      <span>📅 {formatDate(activeMessage.created_at)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(activeMessage.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Delete Message
                  </button>
                </div>

                {/* Subject Block */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject / Property</span>
                  <div className="text-base font-bold text-slate-900 mt-1">{activeMessage.subject || 'General Inquiry'}</div>
                </div>

                {/* Message Content */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message Body</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 text-slate-700 text-sm leading-relaxed whitespace-pre-line mt-2">
                    {activeMessage.message}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-350 p-16 text-center text-slate-400 max-w-lg mx-auto">
                <span className="text-5xl">📬</span>
                <h3 className="font-serif text-lg font-bold text-slate-800 mt-4">Select an inquiry</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Click on any message in the inbox listing to view the sender details and read the full message.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </Authenticated>
  );
}

