"use client";

import { Badge } from "@saltwise/ui/components/badge";
import {
  ArrowRightIcon,
  PillIcon,
  ShieldCheckIcon,
  TrendingDownIcon,
} from "lucide-react";
import Link from "next/link";
import type { DrugSearchResult } from "@/lib/types";

interface MedicineCardProps {
  result: DrugSearchResult;
  index?: number;
}

export function MedicineCard({ result, index = 0 }: MedicineCardProps) {
  const { drug, alternatives } = result;
  const hasAlternatives = alternatives.length > 0;
  const bestSavings = hasAlternatives
    ? Math.max(...alternatives.map((a) => a.savingsPercent))
    : 0;

  return (
    <Link
      className="group/card block"
      href={`/medicine/${drug.id}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="fade-in slide-in-from-bottom-3 relative flex h-full animate-in flex-col overflow-hidden rounded-2xl border border-border/40 bg-white/60 fill-mode-forwards shadow-sm backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]">
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Image / Pill icon area */}
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted/20 via-muted/10 to-transparent">
          {/* Decorative background circles */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-6 -right-6 size-24 rounded-full bg-primary/[0.04]" />
            <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-accent/[0.06]" />
          </div>

          <div className="flex flex-col items-center gap-2 text-muted-foreground/30 transition-transform duration-500 ease-out group-hover/card:scale-110">
            <PillIcon className="size-12" strokeWidth={1} />
          </div>

          {/* Savings badge overlay */}
          {bestSavings > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="gap-1 border-0 bg-emerald-500/90 text-[0.6rem] text-white shadow-sm backdrop-blur-sm dark:bg-emerald-500/80">
                <TrendingDownIcon className="size-2.5" />
                Save up to {bestSavings.toFixed(0)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 pt-3">
          {/* Brand + GMP */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-heading font-semibold text-foreground text-sm tracking-tight">
              {drug.brandName}
            </h3>
            {drug.gmpCertified && (
              <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-500/10">
                <ShieldCheckIcon className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden text-[0.5rem] text-emerald-700 sm:inline dark:text-emerald-400">
                  GMP
                </span>
              </div>
            )}
          </div>

          {/* Salt composition */}
          <p className="mt-0.5 line-clamp-1 text-muted-foreground text-xs">
            {drug.salt}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge
              className="border-border/50 bg-white/80 text-[0.6rem] dark:bg-white/5"
              variant="outline"
            >
              {drug.strength}
            </Badge>
            <Badge
              className="border-border/50 bg-white/80 text-[0.6rem] dark:bg-white/5"
              variant="outline"
            >
              {drug.form}
            </Badge>
          </div>

          {/* Bottom row: price + CTA */}
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {drug.price != null && (
                <p className="font-heading font-semibold text-base tabular-nums">
                  <span className="text-foreground/40 text-xs">₹</span>
                  {drug.price.toFixed(2)}
                </p>
              )}
              <p className="truncate text-[0.6rem] text-muted-foreground/70">
                {drug.manufacturer}
              </p>
            </div>

            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary/60 transition-all duration-300 group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:shadow-md">
              <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-px" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
