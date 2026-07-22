export default function Testimonial({ name, location, quote }) {
    return (
        <figure className="bg-white/60 border border-ink/10 rounded-sm p-6 h-full flex flex-col">
            <blockquote className="text-ink/80 leading-relaxed flex-1">“{quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-slate-900">{name}</span>
                <span className="text-ink/50"> — {location}</span>
            </figcaption>
        </figure>
    );
}
