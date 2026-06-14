import React from "react";
import ShareButton from "@/components/filter/share-button";
import type { PageKey } from "@/lib/url-state/registry";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  pageKey?: PageKey;
  state?: Record<string, unknown>;
}

const Section = ({
  title,
  children,
  outerClassName,
  innerClassName,
  pageKey,
  state,
}: SectionProps) => {
  return (
    <section className={`flex flex-col gap-4 ${outerClassName || ""}`}>
      <div className="flex justify-between">
        <span className="font-bold uppercase text-lg tracking-wide">
          {title}
        </span>
        {pageKey && state && <ShareButton page={pageKey} state={state} />}
      </div>
      <div className={`flex flex-col gap-3 ${innerClassName || ""}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
