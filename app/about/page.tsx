import Link from "next/link";
import { goals, highlightMetrics, missionBullets, pastHighlights } from "@/lib/data";

export const metadata = {
  title: "About | MASA Hackathon 2026: R-Ignite",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          About MASA
        </p>
        <h1 className="text-4xl font-bold text-white">National student body for actuarial students</h1>
        <p className="text-lg text-[rgba(248,244,246,0.85)]">
          MASA is a national student representative body of actuarial students in Malaysia, established to
          unite actuarial science students across Malaysia and empower them to be the next generation of
          actuarial leaders.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-2xl font-semibold text-white">Vision</h2>
          <p className="mt-3 text-[rgba(248,244,246,0.85)]">
            Create a national platform for industrial exposure, academic support, and networking opportunities.
          </p>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-2xl font-semibold text-white">Goals</h2>
          <ul className="mt-3 space-y-2 text-[rgba(248,244,246,0.85)]">
            {goals.map((goal) => (
              <li key={goal} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 glass-panel p-6">
        <h2 className="text-2xl font-semibold text-white">Mission</h2>
        <ul className="mt-4 space-y-3 text-[rgba(248,244,246,0.85)]">
          {missionBullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-1 block h-2 w-2 rounded-full bg-[rgba(212,100,118,0.9)]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
            Past highlights
          </p>
          <h2 className="text-3xl font-bold text-white">MASA Hackathon 2025: R-Volve</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="glass-panel p-6">
            {pastHighlights.map((highlight) => (
              <div key={highlight.title} className="space-y-3">
                <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                <p className="text-[rgba(248,244,246,0.85)]">{highlight.description}</p>
              </div>
            ))}
          </div>
          <div className="glass-panel grid gap-3 p-6">
            {highlightMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-[rgba(255,255,255,0.02)] px-4 py-3"
              >
                <span className="text-sm text-[rgba(248,244,246,0.8)]">{metric.label}</span>
                <span className="text-lg font-semibold text-white">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="https://www.masassociation.org/" className="btn-secondary">
          MASA Website
        </Link>
        <Link href="https://www.linkedin.com/company/masassociation/" className="btn-secondary">
          MASA LinkedIn
        </Link>
        <Link href="mailto:hackathon@masassociation.org" className="btn-primary">
          Contact MASA
        </Link>
      </div>
    </div>
  );
}
