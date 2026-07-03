"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const keys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function Faq() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("q1");

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading title={t("title")} />
      <div className="space-y-3">
        {keys.map((key) => {
          const isOpen = open === key;
          return (
            <div key={key} className="glass overflow-hidden !p-0">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-white">{t(`${key}.q`)}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gold-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-night-300">{t(`${key}.a`)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
