import Link from "next/link";

const peopleSections = [
  { title: "Judges", href: "/people/judges", status: "Coming Soon" },
  { title: "Mentors", href: "/people/mentors", status: "Coming Soon" },
  { title: "Speakers", href: "/people/speakers", status: "Coming Soon" },
  { title: "Organising Team", href: "/people/organising-team", status: "Name updates coming soon" },
];

export const metadata = {
  title: "People | MASA Hackathon 2026: R-Ignite",
};

export default function PeoplePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          People
        </p>
        <h1 className="text-4xl font-bold text-white">Guides, mentors, and organisers</h1>
        <p className="max-w-4xl text-lg text-[rgba(248,244,246,0.85)]">
          Judges, mentors, and speakers will be announced soon. The organising team roles are listed with
          names to be added later.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {peopleSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="glass-panel flex flex-col gap-3 p-5 transition hover:-translate-y-[2px] hover:border-[rgba(212,100,118,0.4)]"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <span className="badge-soft text-xs">{section.status}</span>
            </div>
            <p className="text-sm text-[rgba(248,244,246,0.85)]">View details</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
