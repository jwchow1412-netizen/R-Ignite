import Image from "next/image";
import Link from "next/link";
import Timeline from "@/components/Timeline";
import { executionPhases, timelineItems, whyJoin } from "@/lib/data";

const shortTimeline = timelineItems.slice(0, 3);

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-center md:gap-12 md:px-6 md:py-20">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.12)]">
              <Image
                src="/logo.svg"
                alt="R-Ignite logo"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
            <span className="badge-soft">Malaysian Actuarial Student Association (MASA)</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            MASA Hackathon 2026: R-Ignite
          </h1>
          <p className="max-w-3xl text-lg text-[rgba(248,244,246,0.85)]">
            MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon
            2026: R-Ignite”. This two-month event offers Actuarial Science students an opportunity
            to apply theoretical knowledge to real-world problems, gain hands-on experience,
            enhance analytical skills, and network with industry professionals. The hackathon
            bridges academia and industry, fostering innovation and preparing participants for
            future challenges in the actuarial field.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn-primary">
              Register Interest (Coming Soon)
            </Link>
            <Link href="/downloads/handbook.pdf" className="btn-secondary">
              Download Handbook
            </Link>
            <span className="badge-soft">Focus track: Cybersecurity Risk (subject to change)</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Organizer</p>
              <p className="text-lg font-semibold text-white">Malaysian Actuarial Student Association (MASA)</p>
            </div>
            <div className="glass-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Duration</p>
              <p className="text-lg font-semibold text-white">Two-month event</p>
            </div>
            <div className="glass-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Contact</p>
              <p className="text-lg font-semibold text-white">hackathon@masassociation.org</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="glass-panel space-y-4 p-6 shadow-card">
            <p className="text-sm font-semibold text-white">Execution steps</p>
            <ul className="space-y-3">
              {executionPhases.map((phase) => (
                <li key={phase.title} className="rounded-lg border border-border/70 bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{phase.title}</p>
                      <p className="text-sm text-[rgba(248,244,246,0.75)]">{phase.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-lg border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.08)] p-3 text-sm text-[rgba(248,244,246,0.85)]">
              Participants work with an insurance-related dataset and learn data preprocessing during the
              workshop, then build predictive models, generate reports, and create visualisations. Top 6 teams
              are shortlisted to proceed to the Grand Final and present to judges.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
              Why Join Us
            </p>
            <h2 className="text-3xl font-bold text-white">Built for actuarial students and partners</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {whyJoin.map((item) => (
              <div key={item} className="glass-panel p-5">
                <p className="text-base text-[rgba(248,244,246,0.9)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
            Key Dates
          </p>
          <h2 className="text-3xl font-bold text-white">Save the milestones</h2>
          <p className="text-[rgba(248,244,246,0.8)]">
            Follow the journey from registration through the Grand Final. Full details are available in the
            timeline page.
          </p>
        </div>
        <div className="mt-6">
          <Timeline items={shortTimeline} />
          <div className="mt-4">
            <Link href="/timeline" className="btn-secondary">
              View full timeline
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="glass-panel grid gap-6 p-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">Ready to collaborate?</h3>
            <p className="text-[rgba(248,244,246,0.8)]">
              MASA Hackathon 2026: R-Ignite connects Actuarial Science students with industry to solve
              real-world problems. Updates marked Coming Soon will be refreshed here as details are confirmed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary">
                Register Interest
              </Link>
              <Link href="mailto:hackathon@masassociation.org" className="btn-secondary">
                Contact MASA
              </Link>
            </div>
          </div>
          <div className="grid gap-3 rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[rgba(248,244,246,0.78)]">Focus track</span>
              <span className="rounded-full bg-[rgba(212,100,118,0.18)] px-3 py-1 text-xs font-semibold text-white">
                Cybersecurity Risk (subject to change)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[rgba(248,244,246,0.78)]">Grand Final</span>
              <span className="text-white">Held physically</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[rgba(248,244,246,0.78)]">Teams shortlisted</span>
              <span className="text-white">Top 6 teams</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
