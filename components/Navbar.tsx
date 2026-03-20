"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

const mainLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Track", href: "/track" },
  { name: "Timeline", href: "/timeline" },
  { name: "Resources", href: "/resources" },
  { name: "FAQ", href: "/faq" },
  { name: "CUHK", href: "/cuhk" },
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

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);

  const renderLink = (link: { name: string; href: string }) => {
    const active = linkIsActive(pathname, link.href);
    return (
      <Link
        key={link.name}
        href={link.href}
        className={`px-2 py-2 text-[13px] lg:px-3 lg:text-sm font-semibold transition-colors rounded-lg ${active
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
    <header
      className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-md"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3 md:px-6 gap-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="MASA Hackathon 2026: R-Ignite home"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.18)]">
            <Image
              src="/logo.svg"
              alt="R-Ignite logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div>MASA Hackathon 2026</div>
            <div className="text-xs text-[rgba(248,244,246,0.7)]">R-Ignite</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {mainLinks.map(renderLink)}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setPeopleOpen((prev) => !prev)}
              className={`px-2 py-2 text-[13px] lg:px-3 lg:text-sm font-semibold rounded-lg inline-flex items-center gap-1 transition-colors ${pathname.startsWith("/people")
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
          <div className="ml-1 flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="icon" className="bg-[#5865F2] hover:bg-[#4752C4] border-none text-white h-9 w-9">
              <Link href={user ? "https://discord.gg/vqG2PehMe" : "/login"} target={user ? "_blank" : undefined} rel={user ? "noopener noreferrer" : undefined}>
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="outline" className="border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.1)] hover:bg-[rgba(212,100,118,0.2)] text-white px-3">
                <Link href="/rewards">
                  Rewards ✨
                </Link>
              </Button>
            ) : null}

            <Button asChild variant="secondary" className="px-3">
              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfTOyeH4B4OYs_yuLv7MEi5EgzXpWTqX1KCSRBz6u-yKUlWPg/viewform?usp=sharing&ouid=106110738148825842904" target="_blank" rel="noopener noreferrer">
                Register
              </Link>
            </Button>
          </div>
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
            <div className="mt-2 flex items-center gap-3">
              <Button 
                asChild 
                variant="outline" 
                size="icon" 
                className="bg-[#5865F2] hover:bg-[#4752C4] border-none text-white shrink-0 h-10 w-10 flex items-center justify-center p-0"
                onClick={() => setMobileOpen(false)}
              >
                <Link href={user ? "https://discord.gg/vqG2PehMe" : "/login"} target={user ? "_blank" : undefined} rel={user ? "noopener noreferrer" : undefined}>
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                </Link>
              </Button>
              {user ? (
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.1)] hover:bg-[rgba(212,100,118,0.2)] text-white w-full max-w-[150px]"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/rewards">
                    Rewards Portal ✨
                  </Link>
                </Button>
              ) : null}
              <Button
                asChild
                className="flex-1 justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfTOyeH4B4OYs_yuLv7MEi5EgzXpWTqX1KCSRBz6u-yKUlWPg/viewform?usp=sharing&ouid=106110738148825842904" target="_blank" rel="noopener noreferrer">
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
