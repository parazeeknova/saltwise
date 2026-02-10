"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@saltwise/ui/components/alert";
import { Badge } from "@saltwise/ui/components/badge";
import { Button } from "@saltwise/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@saltwise/ui/components/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@saltwise/ui/components/table";
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  InfoIcon,
  PillIcon,
  ShieldCheckIcon,
  StoreIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { MeshBackground } from "@/components/mesh-background";
import { getDrugById } from "@/lib/mock-data";
import type {
  DrugAlternative,
  DrugSearchResult,
  PharmacyPrice,
} from "@/lib/types";

function confidenceBadgeVariant(confidence: PharmacyPrice["confidence"]) {
  switch (confidence) {
    case "live":
      return "default";
    case "recent":
      return "secondary";
    case "cached":
      return "outline";
    case "estimated":
      return "ghost";
    default:
      return "outline";
  }
}

function safetyExplanation(
  alternative: DrugAlternative,
  originalDrug: DrugSearchResult["drug"]
): string {
  if (alternative.safetyTier === "exact_generic") {
    return `${alternative.drug.brandName} contains the exact same active ingredient (${originalDrug.salt}) in the same strength (${originalDrug.strength}) and dosage form as ${originalDrug.brandName}. Generic medicines are required by CDSCO to demonstrate bioequivalence — meaning they are absorbed into the body at the same rate and to the same extent as the branded version.${alternative.drug.gmpCertified ? ` ${alternative.drug.manufacturer} is a GMP-certified manufacturer, ensuring quality standards are met.` : ""}`;
  }
  return `${alternative.drug.brandName} contains a therapeutically equivalent formulation to ${originalDrug.brandName}. While not an exact generic, it belongs to the same drug class and works through the same mechanism. Your doctor can confirm if this substitution is appropriate for your condition.`;
}

function AlternativeCard({
  alternative,
  originalDrug,
  index,
}: {
  alternative: DrugSearchResult["alternatives"][number];
  originalDrug: DrugSearchResult["drug"];
  index: number;
}) {
  const { drug, pricePerUnit, savings, savingsPercent, safetyTier } =
    alternative;

  return (
    <div
      className="fade-in slide-in-from-bottom-2 animate-in fill-mode-forwards duration-500 ease-out"
      style={{ animationDelay: `${300 + index * 100}ms` }}
    >
      <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-white/60 p-4 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/5">
                <PillIcon className="size-3.5 text-primary/60" />
              </div>
              <span className="font-heading font-semibold text-sm">
                {drug.brandName}
              </span>
              <Badge
                className="border-border/50 bg-white/80 text-[0.55rem] dark:bg-white/5"
                variant="outline"
              >
                {safetyTier === "exact_generic"
                  ? "Exact Generic"
                  : "Therapeutic Equivalent"}
              </Badge>
            </div>
            <p className="pl-9 text-muted-foreground text-xs">
              {drug.manufacturer}
              {drug.gmpCertified && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheckIcon className="size-3" />
                  GMP
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 pl-9 sm:pl-0">
            <div className="text-right">
              <p className="font-heading font-semibold text-sm tabular-nums">
                <span className="text-foreground/40 text-xs">₹</span>
                {pricePerUnit.toFixed(2)}
                <span className="text-muted-foreground text-xs">/unit</span>
              </p>
              {drug.price != null && (
                <p className="text-muted-foreground/70 text-xs">
                  ₹{drug.price.toFixed(2)}/pack
                </p>
              )}
            </div>
            {savings > 0 && (
              <Badge className="gap-1 border-0 bg-emerald-500/90 text-[0.6rem] text-white shadow-sm dark:bg-emerald-500/80">
                <ArrowDownIcon className="size-2.5" />
                Save {savingsPercent.toFixed(0)}%
              </Badge>
            )}
          </div>
        </div>

        {/* Why is this safe? */}
        <Collapsible className="mt-3 w-full">
          <CollapsibleTrigger className="group/trigger flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-muted-foreground text-xs transition-colors hover:bg-muted/30 hover:text-foreground">
            <InfoIcon className="size-3 shrink-0" />
            <span>Why is this safe?</span>
            <ChevronDownIcon className="ml-auto size-3 shrink-0 transition-transform group-data-[panel-open]/trigger:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-collapse-in overflow-hidden data-[ending-style]:animate-collapse-out data-[starting-style]:animate-collapse-out">
            <p className="mt-2 rounded-lg border border-border/30 bg-muted/20 p-3 text-muted-foreground text-xs leading-relaxed backdrop-blur-sm">
              {safetyExplanation(alternative, originalDrug)}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function PriceComparisonTable({ prices }: { prices: PharmacyPrice[] }) {
  if (prices.length === 0) {
    return null;
  }

  const sorted = [...prices].sort((a, b) => a.perUnit - b.perUnit);
  const lowestPerUnit = sorted[0]?.perUnit;

  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-white/60 backdrop-blur-xl dark:bg-white/[0.04]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="font-heading text-xs">Pharmacy</TableHead>
            <TableHead className="text-right font-heading text-xs">
              Price
            </TableHead>
            <TableHead className="text-right font-heading text-xs">
              Pack
            </TableHead>
            <TableHead className="text-right font-heading text-xs">
              Per Unit
            </TableHead>
            <TableHead className="text-center font-heading text-xs">
              Stock
            </TableHead>
            <TableHead className="text-center font-heading text-xs">
              Data
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((price, i) => (
            <TableRow
              className="border-border/20 transition-colors hover:bg-primary/[0.02]"
              key={price.pharmacy}
              style={{ animationDelay: `${600 + i * 80}ms` }}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {price.pharmacy}
                  {price.perUnit === lowestPerUnit && (
                    <Badge className="border-0 bg-emerald-500/90 text-[0.5rem] text-white">
                      Best
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                ₹{price.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {price.packSize}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                ₹{price.perUnit.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {price.inStock ? (
                  <CheckCircleIcon className="mx-auto size-3.5 text-emerald-500" />
                ) : (
                  <CircleIcon className="mx-auto size-3.5 text-muted-foreground/30" />
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className="text-[0.5rem]"
                  variant={confidenceBadgeVariant(price.confidence)}
                >
                  {price.confidence}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CostComparisonBar({
  originalDrug,
  originalPerUnit,
  alternatives,
}: {
  originalDrug: DrugSearchResult["drug"];
  originalPerUnit: number;
  alternatives: DrugAlternative[];
}) {
  const cheapest = [...alternatives].sort(
    (a, b) => a.pricePerUnit - b.pricePerUnit
  )[0];
  if (!cheapest) {
    return null;
  }

  const optimizedPerUnit = cheapest.pricePerUnit;
  const savingsPerUnit = originalPerUnit - optimizedPerUnit;
  const savingsPercent =
    originalPerUnit > 0 ? (savingsPerUnit / originalPerUnit) * 100 : 0;

  if (savingsPerUnit <= 0) {
    return null;
  }

  const optimizedBarPercent = (optimizedPerUnit / originalPerUnit) * 100;

  return (
    <div
      className="fade-in slide-in-from-bottom-2 animate-in fill-mode-forwards duration-700"
      style={{ animationDelay: "500ms" }}
    >
      <div className="overflow-hidden rounded-xl border border-border/40 bg-white/60 p-5 backdrop-blur-xl dark:bg-white/[0.04]">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="space-y-4">
          {/* Original cost bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {originalDrug.brandName}
                <span className="ml-1 text-muted-foreground/50">(Current)</span>
              </span>
              <span className="font-heading font-medium tabular-nums">
                ₹{originalPerUnit.toFixed(2)}/unit
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full bg-foreground/15 transition-all duration-1000 ease-out"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Optimized cost bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {cheapest.drug.brandName}
                <span className="ml-1 font-normal text-emerald-600/60 dark:text-emerald-400/60">
                  (Cheapest)
                </span>
              </span>
              <span className="font-heading font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                ₹{optimizedPerUnit.toFixed(2)}/unit
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all delay-300 duration-1000 ease-out"
                style={{ width: `${Math.max(optimizedBarPercent, 4)}%` }}
              />
            </div>
          </div>

          {/* Savings summary */}
          <div className="flex items-center justify-between rounded-lg bg-emerald-50/60 p-3 dark:bg-emerald-500/5">
            <span className="text-muted-foreground text-xs">
              Potential savings per unit
            </span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-emerald-600 text-sm tabular-nums dark:text-emerald-400">
                ₹{savingsPerUnit.toFixed(2)}
              </span>
              <Badge className="gap-1 border-0 bg-emerald-500/90 text-[0.6rem] text-white shadow-sm">
                <ArrowDownIcon className="size-2.5" />
                {savingsPercent.toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="relative min-h-screen">
      {/* <MeshBackground opacity={0.5} /> */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 lg:px-8">
        <div className="mb-8 h-8 w-32 animate-pulse rounded-lg bg-muted/40" />
        <div className="space-y-6">
          <div className="h-48 w-full animate-pulse rounded-2xl bg-muted/30" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="relative min-h-screen">
      {/* <MeshBackground opacity={0.5} /> */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 lg:px-8">
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute inset-1 rounded-full bg-white/80 backdrop-blur-sm dark:bg-white/5" />
            <PillIcon
              className="relative size-8 text-muted-foreground/40"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-title text-2xl text-foreground">
            Medicine not found
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We couldn&apos;t find this medicine in our database.
          </p>
          <Link href="/search">
            <Button
              className="mt-6 gap-2 rounded-full border-border/40 bg-white/50 backdrop-blur-sm hover:bg-white/70 hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
              variant="outline"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  delay?: number;
}) {
  return (
    <div
      className="fade-in slide-in-from-bottom-2 flex animate-in items-center gap-3 fill-mode-forwards duration-500 ease-out"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/5">
        <Icon className="size-4 text-primary/70" />
      </div>
      <div>
        <h2 className="font-heading font-semibold text-sm tracking-tight">
          {title}
        </h2>
        {count != null && count > 0 && (
          <p className="text-muted-foreground/60 text-xs">
            {count} {count === 1 ? "option" : "options"} found
          </p>
        )}
      </div>
    </div>
  );
}

export default function MedicineDetailsPage() {
  const { id } = useParams();
  const [result, setResult] = useState<DrugSearchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const drug = getDrugById(id as string);
        setResult(drug);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (!result) {
    return <NotFoundState />;
  }

  const { drug, alternatives, prices, isSubstitutable, ntiWarning } = result;
  const originalPerUnit =
    drug.price && drug.packSize ? drug.price / drug.packSize : null;

  return (
    <div className="relative min-h-screen">
      {/* <MeshBackground opacity={0.5} /> */}

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 lg:px-8">
        {/* Back navigation */}
        <div className="fade-in slide-in-from-left-4 mb-8 animate-in fill-mode-forwards duration-500 ease-out">
          <Link
            className="group inline-flex items-center gap-2 rounded-full border border-border/40 bg-white/50 px-4 py-2 text-muted-foreground text-sm shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-white/70 hover:text-foreground hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
            href="/search"
          >
            <ArrowLeftIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Search
          </Link>
        </div>

        {/* Medicine Identity Hero */}
        <div
          className="fade-in slide-in-from-bottom-4 animate-in fill-mode-forwards duration-700 ease-out"
          style={{ animationDelay: "100ms" }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:bg-white/[0.04]">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 size-60 rounded-full bg-primary/[0.03]" />
              <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-accent/[0.04]" />
            </div>

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                {/* Brand name */}
                <h1 className="font-title text-3xl text-foreground tracking-tight sm:text-4xl">
                  {drug.brandName}
                </h1>

                {/* Salt composition */}
                <p className="font-heading text-muted-foreground text-sm">
                  {drug.salt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
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
                  <Badge
                    className="border-border/50 bg-white/80 text-[0.6rem] dark:bg-white/5"
                    variant="outline"
                  >
                    {drug.manufacturer}
                  </Badge>
                  {drug.gmpCertified && (
                    <Badge className="gap-1 border-0 bg-emerald-50 text-[0.6rem] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <ShieldCheckIcon className="size-2.5" />
                      GMP Certified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price callout */}
              {originalPerUnit != null && (
                <div className="shrink-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-4 text-right sm:min-w-[140px]">
                  <p className="font-title text-3xl tabular-nums">
                    <span className="text-foreground/40 text-lg">₹</span>
                    {drug.price?.toFixed(2)}
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    ₹{originalPerUnit.toFixed(2)}/unit
                    {drug.packSize ? ` · Pack of ${drug.packSize}` : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NTI Warning */}
        {ntiWarning && (
          <div
            className="fade-in slide-in-from-bottom-2 mt-6 animate-in fill-mode-forwards duration-500"
            style={{ animationDelay: "200ms" }}
          >
            <Alert variant="destructive">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>Non-Substitutable Medicine</AlertTitle>
              <AlertDescription>{ntiWarning}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Generic Alternatives */}
        {isSubstitutable && (
          <div className="mt-10 space-y-4">
            <SectionHeader
              count={alternatives.length}
              delay={250}
              icon={TagIcon}
              title="Generic Alternatives"
            />

            {alternatives.length > 0 ? (
              <div className="space-y-3">
                {alternatives.map((alt, i) => (
                  <AlternativeCard
                    alternative={alt}
                    index={i}
                    key={alt.drug.id}
                    originalDrug={drug}
                  />
                ))}
              </div>
            ) : (
              <div
                className="fade-in animate-in fill-mode-forwards duration-500"
                style={{ animationDelay: "350ms" }}
              >
                <div className="rounded-xl border border-border/40 bg-white/60 p-6 text-center backdrop-blur-xl dark:bg-white/[0.04]">
                  <p className="text-muted-foreground text-sm">
                    No generic alternatives found. This is already the most
                    cost-effective option we know of.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cost Comparison */}
        {isSubstitutable &&
          alternatives.length > 0 &&
          originalPerUnit != null && (
            <div className="mt-10 space-y-4">
              <SectionHeader
                delay={450}
                icon={ArrowDownIcon}
                title="Cost Comparison"
              />
              <CostComparisonBar
                alternatives={alternatives}
                originalDrug={drug}
                originalPerUnit={originalPerUnit}
              />
            </div>
          )}

        {/* Price Comparison */}
        {prices.length > 0 && (
          <div className="mt-10 space-y-4">
            <SectionHeader
              count={prices.length}
              delay={550}
              icon={StoreIcon}
              title="Pharmacy Prices"
            />
            <div
              className="fade-in slide-in-from-bottom-2 animate-in fill-mode-forwards duration-500"
              style={{ animationDelay: "600ms" }}
            >
              <PriceComparisonTable prices={prices} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
