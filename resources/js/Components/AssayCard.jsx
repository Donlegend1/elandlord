/**
 * The site's signature visual element: a card styled after a real mining
 * assay/certification report. Used for hero stats and product specs so the
 * "documentation, not just claims" positioning shows up in the UI itself.
 */
export default function AssayCard({ eyebrow = 'Assay Report', items = [], className = '' }) {
    return (
        <div className={`assay-card p-6 ${className}`}>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-ore-light font-mono mb-4">
                <span>{eyebrow}</span>
                <span>No. {Math.floor(Math.random() * 90000 + 10000)}</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {items.map(([label, value]) => (
                    <div key={label}>
                        <dt className="text-xs text-paper/60">{label}</dt>
                        <dd className="font-mono text-lg text-paper mt-0.5">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
