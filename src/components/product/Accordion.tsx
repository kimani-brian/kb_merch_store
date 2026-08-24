"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionSection {
  title: string;
  content: string;
}

export default function Accordion({ sections }: { sections: AccordionSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-2 border-brand-gray-dark">
      {sections.map((section, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={section.title} className={i > 0 ? "border-t-2 border-brand-gray-dark" : ""}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-brand-white uppercase">
                {section.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <p className="font-mono text-xs leading-relaxed whitespace-pre-line text-neutral-400">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
