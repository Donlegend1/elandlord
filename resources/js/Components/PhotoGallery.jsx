import { useState } from 'react';

export default function PhotoGallery({ images = [], alt = 'Photo' }) {
    const [active, setActive] = useState(0);
    const urls = images.filter(Boolean);

    if (urls.length === 0) {
        return (
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-tr from-slate-800 to-indigo-900 h-72 sm:h-96 flex items-center justify-center text-white/70 text-sm">
                No photo yet
            </div>
        );
    }

    const current = urls[Math.min(active, urls.length - 1)];

    return (
        <div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 h-72 sm:h-96">
                <img src={current} alt={alt} className="w-full h-full object-cover" />
            </div>
            {urls.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {urls.map((url, index) => (
                        <button
                            key={url + index}
                            type="button"
                            onClick={() => setActive(index)}
                            className={
                                'h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 ' +
                                (index === active ? 'border-indigo-600' : 'border-transparent')
                            }
                        >
                            <img src={url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
