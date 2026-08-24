import { useEffect, useState } from 'react';

function FileThumb({ file, onRemove }) {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setSrc(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className="relative h-20 w-24 shrink-0">
            {src && <img src={src} alt={file.name} className="h-20 w-24 rounded-lg object-cover border border-slate-200" />}
            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-600 text-white text-xs font-bold leading-none"
                aria-label="Remove photo"
            >
                ×
            </button>
        </div>
    );
}

export default function ImagePicker({
    label = 'Photos',
    files = [],
    onChange,
    existing = [],
    onRemoveExisting,
    max = 12,
    error,
}) {
    const remaining = Math.max(0, max - existing.length - files.length);

    const addFiles = (fileList) => {
        const incoming = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
        onChange([...files, ...incoming].slice(0, max - existing.length));
    };

    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">{label}</label>
            <p className="text-[11px] text-slate-500 mb-2">
                JPG, PNG, or WEBP. Up to {max} photos{remaining === 0 ? ' — limit reached' : `, ${remaining} remaining`}.
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
                {existing.map((image) => (
                    <div key={image.id} className="relative h-20 w-24 shrink-0">
                        <img src={image.url} alt="" className="h-20 w-24 rounded-lg object-cover border border-slate-200" />
                        {onRemoveExisting && (
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(image.id)}
                                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-600 text-white text-xs font-bold leading-none"
                                aria-label="Remove saved photo"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {files.map((file, index) => (
                    <FileThumb
                        key={`${file.name}-${file.size}-${index}`}
                        file={file}
                        onRemove={() => onChange(files.filter((_, i) => i !== index))}
                    />
                ))}
            </div>

            {remaining > 0 && (
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = '';
                    }}
                />
            )}
            {error && <span className="text-xs text-rose-500">{error}</span>}
        </div>
    );
}
