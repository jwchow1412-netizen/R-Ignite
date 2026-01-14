import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-border"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-sm font-semibold text-white">MASA Hackathon 2026: R-Ignite</p>
          <p className="text-sm text-[rgba(248,244,246,0.75)]">
            Organised by Malaysian Actuarial Student Association (MASA)
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-[rgba(248,244,246,0.85)]">
          <Link
            href="https://www.masassociation.org/"
            className="rounded-lg border border-transparent px-3 py-2 hover:border-border hover:bg-[rgba(255,255,255,0.05)]"
          >
            MASA Website
          </Link>
          <Link
            href="https://www.linkedin.com/company/masassociation/"
            className="rounded-lg border border-transparent px-3 py-2 hover:border-border hover:bg-[rgba(255,255,255,0.05)]"
          >
            LinkedIn
          </Link>
          <a
            href="mailto:hackathon@masassociation.org"
            className="rounded-lg border border-transparent px-3 py-2 hover:border-border hover:bg-[rgba(255,255,255,0.05)]"
          >
            hackathon@masassociation.org
          </a>
        </div>
      </div>
    </footer>
  );
}
