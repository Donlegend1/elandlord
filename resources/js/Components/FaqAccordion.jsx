import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                    <div key={faq.q}>
                        <h3>
                            <button
                                type="button"
                                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                                aria-expanded={isOpen}
                                aria-controls={`faq-panel-${i}`}
                                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                            >
                                <span className="font-display text-lg text-slate-900">{faq.q}</span>
                                <span className="text-2xl text-ore-dark leading-none">{isOpen ? '−' : '+'}</span>
                            </button>
                        </h3>
                        {isOpen && (
                            <div id={`faq-panel-${i}`} className="pb-5 pr-10 text-ink/70 leading-relaxed">
                                {faq.a}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
