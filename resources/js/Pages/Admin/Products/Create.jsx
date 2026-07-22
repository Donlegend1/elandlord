import { Head, useForm, Link } from '@inertiajs/react';
import Authenticated from '../Layouts/Authenticated';
import axios from 'axios';

const COMMON_AMENITIES = [
  'Swimming Pool', 'Gym', 'Gated Community', 'Staff Quarters', 
  'Landscaped Garden', 'Backup Generator', 'Borehole', 
  'Solar Heating', 'Fully Furnished', 'Electric Fence', 'Family Room'
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category: 'sale',
    tagline: '',
    description: '',
    image: '',
    images: [],
    price: '',
    location: '',
    type: 'Villa',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'For Sale',
    amenities: []
  });

  const handleAmenityChange = (amenity) => {
    const isChecked = data.amenities.includes(amenity);
    if (isChecked) {
      setData('amenities', data.amenities.filter(item => item !== amenity));
    } else {
      setData('amenities', [...data.amenities, amenity]);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('/admin/properties/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const uploadedUrl = response.data.url;
        setData(prev => {
          const updatedImages = [...prev.images, uploadedUrl];
          return {
            ...prev,
            images: updatedImages,
            image: prev.image || uploadedUrl
          };
        });
      } catch (err) {
        console.error(err);
        alert('Failed to upload image: ' + (err.response?.data?.error || err.message));
      }
    }
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setData(prev => {
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updatedImages,
        image: updatedImages[0] || ''
      };
    });
  };

  const submit = e => {
    e.preventDefault();
    post('/admin/properties', {
      onSuccess: () => alert('Property created successfully!')
    });
  };

  return (
    <Authenticated header="Add Property Listing">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Add New Property</h2>
          <p className="text-slate-500 text-sm mt-1">Fill out the form below to add a new listing to the public website.</p>
        </div>

        {/* Form Card */}
        <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8 space-y-6">
          
          {/* Main Info Section */}
          <div className="border-b border-slate-100 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Property Name / Title *</label>
              <input
                type="text"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="e.g. Elegant 5-Bedroom Executive Mansion"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Category *</label>
              <select
                value={data.category}
                onChange={e => setData('category', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 bg-white"
              >
                <option value="sale">For Sale</option>
                <option value="rental">For Rent</option>
                <option value="land">Prime Land</option>
                <option value="off-plan">Off-Plan Projects</option>
              </select>
              {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Property Type *</label>
              <select
                value={data.type}
                onChange={e => setData('type', e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 bg-white"
              >
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Mansion">Mansion</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land Plot</option>
              </select>
              {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Short Tagline *</label>
              <input
                type="text"
                required
                value={data.tagline}
                onChange={e => setData('tagline', e.target.value)}
                placeholder="e.g. Stunning family home close to UN agencies and international schools."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.tagline && <div className="text-red-500 text-xs mt-1">{errors.tagline}</div>}
            </div>
          </div>

          {/* Pricing & Location Section */}
          <div className="border-b border-slate-100 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Asking Price (with currency) *</label>
              <input
                type="text"
                required
                value={data.price}
                onChange={e => setData('price', e.target.value)}
                placeholder="e.g. KES 120,000,000 or KES 450,000 / month"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Location *</label>
              <input
                type="text"
                required
                value={data.location}
                onChange={e => setData('location', e.target.value)}
                placeholder="e.g. Karen, Nairobi"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Listing Status *</label>
              <input
                type="text"
                required
                value={data.status}
                onChange={e => setData('status', e.target.value)}
                placeholder="e.g. For Sale, For Rent, Off-Plan"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
            </div>

            {/* Property Images Upload Component */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Property Images</label>
              
              {/* Image previews */}
              {data.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {data.images.map((url, idx) => (
                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-maroon-600 text-white px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload trigger */}
              <div className="flex justify-center items-center w-full">
                <label className="flex flex-col justify-center items-center w-full h-32 bg-slate-50 rounded-lg border-2 border-slate-300 border-dashed cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg className="mb-2 w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-1 text-sm text-slate-500 font-semibold">Click to select multiple images</p>
                    <p className="text-xs text-slate-400">PNG, JPG, JPEG, WEBP or GIF (max 10MB each)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.images && <div className="text-red-500 text-xs mt-1">{errors.images}</div>}
            </div>
          </div>

          {/* Sizes / Specs Section */}
          <div className="border-b border-slate-100 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Bedrooms (number)</label>
              <input
                type="number"
                value={data.bedrooms}
                onChange={e => setData('bedrooms', e.target.value)}
                placeholder="e.g. 5"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.bedrooms && <div className="text-red-500 text-xs mt-1">{errors.bedrooms}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Bathrooms (number)</label>
              <input
                type="number"
                value={data.bathrooms}
                onChange={e => setData('bathrooms', e.target.value)}
                placeholder="e.g. 6"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.bathrooms && <div className="text-red-500 text-xs mt-1">{errors.bathrooms}</div>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Land Area / Size (sq ft / Acres)</label>
              <input
                type="text"
                value={data.area}
                onChange={e => setData('area', e.target.value)}
                placeholder="e.g. 6,500 sq ft or 0.5 Acres"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500"
              />
              {errors.area && <div className="text-red-500 text-xs mt-1">{errors.area}</div>}
            </div>
          </div>

          {/* Description Section */}
          <div className="border-b border-slate-100 pb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Long Description *</label>
            <textarea
              required
              rows="6"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              placeholder="Tell us everything about this property: finishes, kitchen details, landscaping, and community amenities..."
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 resize-none"
            />
            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
          </div>

          {/* Amenities Checklist */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Check Premium Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COMMON_AMENITIES.map((amenity) => {
                const checked = data.amenities.includes(amenity);
                return (
                  <label key={amenity} className="flex items-center gap-2.5 text-sm text-slate-700 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-slate-300 text-maroon-600 focus:ring-maroon-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link 
              href="/admin/properties" 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2.5 bg-maroon-600 hover:bg-maroon-500 disabled:bg-slate-400 text-white font-bold text-sm tracking-wide rounded-lg transition-colors shadow"
            >
              {processing ? 'Saving...' : 'Save Property'}
            </button>
          </div>

        </form>
      </div>
    </Authenticated>
  );
}
