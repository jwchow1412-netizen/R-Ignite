import Link from "next/link";

export const metadata = {
  title: "Track | MASA Hackathon 2026: R-Ignite",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          Track
        </p>
        <h1 className="text-4xl font-bold text-white">Cybersecurity Risk</h1>
        <p className="badge-soft w-fit">Subject to change — topic not yet confirmed</p>
        <p className="max-w-4xl text-lg text-[rgba(248,244,246,0.85)]">
          Cybersecurity Risk is the temporary focus track for MASA Hackathon 2026: R-Ignite. Finalised topic
          details will be announced soon. Participants will work with an insurance-related dataset and learn
          data preprocessing during the workshop, then build predictive models, generate reports, and create
          visualisations.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-2xl font-semibold text-white">What to expect</h2>
          <ul className="mt-4 space-y-3 text-[rgba(248,244,246,0.85)]">
            <li className="flex gap-3">
              <span className="mt-1 block h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
              <span>Two-month event bridging academia and industry.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
              <span>Hands-on experience for Actuarial Science students to apply theoretical knowledge.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
              <span>Top 6 teams shortlisted to proceed to the Grand Final and present to judges.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 block h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
              <span>Grand Final held physically with presentations, scenario analyses, strategies, and data visualisations.</span>
            </li>
          </ul>
        </div>
        <div className="glass-panel space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-white">Downloads</h2>
          <p className="text-[rgba(248,244,246,0.85)]">
            Detailed topic documentation will be uploaded soon. Use the resource centre to access current
            placeholders and future updates.
          </p>
          <div className="grid gap-3">
            <Link href="/downloads/problem-statement.pdf" className="btn-secondary">
              Problem Statement (Coming Soon)
            </Link>
            <Link href="/downloads/rubric.pdf" className="btn-secondary">
              Judging Rubric (Coming Soon)
            </Link>
            <Link href="/downloads/terms-and-conditions.pdf" className="btn-secondary">
              Terms &amp; Conditions (Coming Soon)
            </Link>
          </div>
          <Link href="/resources" className="btn-primary">
            Go to Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
