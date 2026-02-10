"use client";

import { Button } from "@saltwise/ui/components/button";
import { Separator } from "@saltwise/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@saltwise/ui/components/sheet";
import {
  CircleUserRoundIcon,
  HistoryIcon,
  MenuIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const PILL_BASE =
  "rounded-full border border-white/30 bg-white/80 shadow-lg backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-white/[0.05] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)] dark:backdrop-saturate-125";

const navLinks = [
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/history", label: "History", icon: HistoryIcon },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = navQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setNavQuery("");
      searchInputRef.current?.blur();
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex w-full justify-center">
      {/* Desktop split nav */}
      <div className="fade-in slide-in-from-top-4 mt-4 hidden w-full animate-in items-center justify-between px-8 duration-700 ease-out md:flex">
        {/* Left pill — Logo */}
        <Link
          className={`${PILL_BASE} flex h-11 items-center gap-2.5 pr-5 pl-2.5 transition-all duration-200 hover:bg-white/90 hover:shadow-xl dark:hover:bg-white/[0.08]`}
          href="/"
        >
          <Image
            alt="Saltwise"
            className="size-6"
            height={28}
            src="/logo.png"
            width={28}
          />
          <span className="font-bold font-heading text-lg tracking-tight">
            Salt<span className="text-primary">wise</span>
          </span>
        </Link>

        {/* Right pill — Search, History, Profile */}
        <div
          className={`${PILL_BASE} flex h-11 items-center gap-1 pr-1.5 pl-2.5`}
        >
          {/* Compact search bar */}
          <form
            className="relative flex items-center"
            onSubmit={handleNavSearch}
          >
            <div
              className={`flex items-center overflow-hidden rounded-full transition-all duration-300 ease-out ${
                searchFocused
                  ? "w-52 bg-black/[0.04] ring-1 ring-primary/20 dark:bg-white/[0.08]"
                  : "w-40 bg-black/[0.03] dark:bg-white/[0.06]"
              }`}
            >
              <SearchIcon
                className={`ml-2.5 size-3.5 shrink-0 transition-colors duration-200 ${
                  searchFocused ? "text-primary" : "text-muted-foreground/60"
                }`}
                strokeWidth={2.5}
              />
              <input
                aria-label="Quick search"
                className="h-7 w-full bg-transparent px-2 text-[0.8rem] text-foreground outline-none placeholder:text-muted-foreground/50"
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => setNavQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search medicines..."
                ref={searchInputRef}
                type="text"
                value={navQuery}
              />
            </div>
          </form>

          {/* Divider */}
          <div className="mx-0.5 h-4 w-px bg-black/[0.06] dark:bg-white/[0.1]" />

          {/* History */}
          <Link href="/history">
            <Button
              className="gap-2 rounded-full"
              size="sm"
              variant={pathname.startsWith("/history") ? "secondary" : "ghost"}
            >
              <HistoryIcon className="size-3.5" data-icon="inline-start" />
              History
            </Button>
          </Link>

          {/* Divider */}
          <div className="mx-0.5 h-4 w-px bg-black/[0.06] dark:bg-white/[0.1]" />

          {/* Profile */}
          <Button
            className="rounded-full text-muted-foreground hover:text-foreground"
            size="icon-sm"
            variant="ghost"
          >
            <CircleUserRoundIcon className="size-4" strokeWidth={1.8} />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>

      {/* Mobile header bar */}
      <div className="flex h-14 w-full items-center justify-between bg-background/80 px-4 backdrop-blur-md md:hidden">
        <Link className="flex items-center gap-2.5" href="/">
          <Image
            alt="Saltwise"
            className="size-7"
            height={28}
            src="/logo.png"
            width={28}
          />
          <span className="font-heading text-lg tracking-tight">Saltwise</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Mobile search shortcut */}
          <Link href="/search">
            <Button size="icon-sm" variant="ghost">
              <SearchIcon className="size-4" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          {/* Mobile profile */}
          <Button
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
          >
            <CircleUserRoundIcon className="size-4" strokeWidth={1.8} />
            <span className="sr-only">Profile</span>
          </Button>

          <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
            <SheetTrigger
              render={
                <Button size="icon-sm" variant="ghost">
                  <MenuIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    className="flex items-center gap-2.5"
                    href="/"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Image
                      alt="Saltwise"
                      className="size-6"
                      height={24}
                      src="/logo.png"
                      width={24}
                    />
                    <span className="font-heading text-base tracking-tight">
                      Saltwise
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      href={link.href}
                      key={link.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        className="w-full justify-start gap-2"
                        size="lg"
                        variant={isActive ? "secondary" : "ghost"}
                      >
                        <link.icon
                          className="size-4"
                          data-icon="inline-start"
                        />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
