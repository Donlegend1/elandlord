import { Head, Link, router } from '@inertiajs/react';
import Authenticated from '../Layouts/Authenticated';

export default function Index({ products }) {
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to permanently delete this property listing?')) {
      router.delete(`/admin/properties/${id}`, {
        onSuccess: () => alert('Property deleted successfully.')
      });
    }
  };

  const categoryLabels = {
    'sale': 'For Sale',
    'rental': 'For Rent',
    'land': 'Land Plot',
    'off-plan': 'Off-Plan'
  };

  return (
    <Authenticated header="Manage Properties">
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-slate-900">Manage Properties</h2>
            <p className="text-slate-500 text-sm mt-1">Add, update, or remove property listings from your public portfolio.</p>
          </div>
          <Link 
            href="/admin/properties/create" 
            className="px-5 py-2.5 bg-maroon-600 hover:bg-maroon-500 text-white font-bold text-sm tracking-wide rounded-lg transition-colors shadow"
          >
            + Add New Property
          </Link>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {products.length > 0 ? (
                  products.map((product) => {
                    const specs = product.specs || {};
                    const price = specs.price || 'Price on Request';
                    const location = specs.location || 'Nairobi, Kenya';
                    const imageUrl = product.image && (product.image.startsWith('http') || product.image.startsWith('/')) 
                        ? product.image 
                        : `/images/products/${product.image || 'villa.jpg'}`;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Property Details */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="w-12 h-9 object-cover rounded bg-slate-100 border border-slate-200"
                          />
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold hover:underline">
                              <Link href={`/products/${product.slug}`} target="_blank">{product.name}</Link>
                            </span>
                            <span className="text-slate-400 text-xs font-normal line-clamp-1">{product.tagline}</span>
                          </div>
                        </td>
                        
                        {/* Category Badge */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded uppercase tracking-wider">
                            {categoryLabels[product.category] || product.category}
                          </span>
                        </td>
                        
                        {/* Location */}
                        <td className="px-6 py-4 text-slate-500">{location}</td>
                        
                        {/* Price */}
                        <td className="px-6 py-4 text-slate-900 font-bold">{price}</td>
                        
                        {/* Action buttons */}
                        <td className="px-6 py-4 text-right space-x-3">
                          <Link 
                            href={`/admin/properties/${product.id}/edit`} 
                            className="text-maroon-600 hover:text-maroon-700 hover:underline text-sm font-semibold"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700 hover:underline text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      No property listings created yet. Click "+ Add New Property" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Authenticated>
  );
}

