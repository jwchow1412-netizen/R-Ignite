"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Track", href: "/track" },
  { name: "Timeline", href: "/timeline" },
  { name: "Resources", href: "/resources" },
  { name: "FAQ", href: "/faq" },
  { name: "Register", href: "/register" },
];

const peopleLinks = [
  { name: "People Landing", href: "/people" },
  { name: "Judges", href: "/people/judges" },
  { name: "Mentors", href: "/people/mentors" },
  { name: "Speakers", href: "/people/speakers" },
  { name: "Organising Team", href: "/people/organising-team" },
];

const linkIsActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);

  const renderLink = (link: { name: string; href: string }) => {
    const active = linkIsActive(pathname, link.href);
    return (
      <Link
        key={link.name}
        href={link.href}
        className={`px-3 py-2 text-sm font-semibold transition-colors rounded-lg ${
          active
            ? "text-white bg-[rgba(212,100,118,0.15)] border border-[rgba(212,100,118,0.35)]"
            : "text-[rgba(248,244,246,0.82)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-[rgba(12,6,12,0.8)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="MASA Hackathon 2026: R-Ignite home"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(212,100,118,0.18)] border border-[rgba(212,100,118,0.35)] text-white font-bold">
            R
          </span>
          <div className="leading-tight">
            <div>MASA Hackathon 2026</div>
            <div className="text-xs text-[rgba(248,244,246,0.7)]">R-Ignite</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {mainLinks.map(renderLink)}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPeopleOpen((prev) => !prev)}
              className={`px-3 py-2 text-sm font-semibold rounded-lg inline-flex items-center gap-1 transition-colors ${
                pathname.startsWith("/people")
                  ? "text-white bg-[rgba(212,100,118,0.15)] border border-[rgba(212,100,118,0.35)]"
                  : "text-[rgba(248,244,246,0.82)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
              }`}
              aria-expanded={peopleOpen}
            >
              People
              <span className={`transition-transform ${peopleOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {peopleOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-[#120712] shadow-xl">
                <div className="flex flex-col p-2">
                  {peopleLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-[rgba(248,244,246,0.85)] hover:bg-[rgba(255,255,255,0.06)]"
                      onClick={() => setPeopleOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/register" className="btn-primary">
            Register Interest
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-[#0e080f] lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 md:px-6">
            {mainLinks.map(renderLink)}
            <details className="group rounded-lg border border-border/60 px-3 py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">
                People
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-2 flex flex-col gap-1">
                {peopleLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-[rgba(248,244,246,0.85)] hover:bg-[rgba(255,255,255,0.06)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </details>
            <Link
              href="/register"
              className="btn-primary justify-center text-center"
              onClick={() => setMobileOpen(false)}
            >
              Register Interest
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
