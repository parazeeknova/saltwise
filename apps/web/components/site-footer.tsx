import { Separator } from "@saltwise/ui/components/separator";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { href: "/search", label: "Search Medicines" },
  { href: "/search", label: "Generic Alternatives" },
  { href: "/upload", label: "Upload Prescription" },
  { href: "/history", label: "Prescription History" },
] as const;

const resourceLinks = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Medical Disclaimer" },
] as const;

const socialLinks = [
  {
    href: "https://twitter.com/saltwise",
    label: "Twitter",
    icon: TwitterIcon,
  },
  {
    href: "https://linkedin.com/company/saltwise",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    href: "https://github.com/saltwise",
    label: "GitHub",
    icon: GithubIcon,
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto w-full">
      {/* Gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Subtle radial background glow */}
      <div className="site-footer-bg relative overflow-hidden">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link className="group inline-flex items-center gap-2.5" href="/">
                <Image
                  alt="Saltwise"
                  className="size-7 transition-transform duration-300 group-hover:scale-110"
                  height={28}
                  src="/logo.png"
                  width={28}
                />
                <span className="font-bold font-heading text-lg tracking-tight">
                  Salt<span className="text-primary">wise</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-muted-foreground/80 text-sm leading-relaxed">
                Find safe, government-approved generic alternatives for your
                branded medicines. Save on every prescription.
              </p>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-1">
                {socialLinks.map((social) => (
                  <a
                    className="group/icon inline-flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/[0.08] dark:hover:bg-primary/[0.12]"
                    href={social.href}
                    key={social.label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <social.icon
                      className="size-4 text-muted-foreground/60 transition-colors duration-200 group-hover/icon:text-primary"
                      strokeWidth={1.8}
                    />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Product column */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h3 className="font-heading text-foreground text-sm tracking-wide">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-muted-foreground/70 text-sm transition-colors duration-200 hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources column */}
            <div className="lg:col-span-2">
              <h3 className="font-heading text-foreground text-sm tracking-wide">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-muted-foreground/70 text-sm transition-colors duration-200 hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div className="lg:col-span-2">
              <h3 className="font-heading text-foreground text-sm tracking-wide">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-muted-foreground/70 text-sm transition-colors duration-200 hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14">
            <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            <div className="flex flex-col items-center gap-4 pt-7 pb-2 sm:flex-row sm:justify-between">
              <p className="text-muted-foreground/50 text-xs">
                &copy; {new Date().getFullYear()} Saltwise. All rights reserved.
              </p>
              <p className="max-w-md text-center text-[0.7rem] text-muted-foreground/40 leading-relaxed sm:text-right">
                Saltwise is an informational platform and is not a substitute
                for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
