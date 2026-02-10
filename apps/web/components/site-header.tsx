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
  HistoryIcon,
  MenuIcon,
  ScaleIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/upload", label: "Upload", icon: UploadIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/compare", label: "Compare", icon: ScaleIcon },
  { href: "/history", label: "History", icon: HistoryIcon },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-border/60 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link className="flex items-center gap-2.5" href="/">
          <Image
            alt="Saltwise"
            className="size-7"
            height={28}
            src="/logo.svg"
            width={28}
          />
          <span className="font-heading text-lg tracking-tight">Saltwise</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link href={link.href} key={link.href}>
                <Button
                  className="gap-1.5"
                  size="sm"
                  variant={isActive ? "secondary" : "ghost"}
                >
                  <link.icon className="size-3.5" data-icon="inline-start" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
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
                      src="/logo.svg"
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
