import Timeline from "@/components/Timeline";
import { executionPhases, grandFinalSchedule, timelineItems, workshopSchedule } from "@/lib/data";

export const metadata = {
  title: "Timeline | MASA Hackathon 2026: R-Ignite",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          Timeline
        </p>
        <h1 className="text-4xl font-bold text-white">Roadmap to the Grand Final</h1>
        <p className="max-w-4xl text-lg text-[rgba(248,244,246,0.85)]">
          Track the milestones from registration through to the physical Grand Final. Participants work with
          an insurance-related dataset and learn data preprocessing during the workshop, then build predictive
          models, generate reports, and create visualisations. Top 6 teams are shortlisted to proceed to the
          Grand Final and present to judges.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <Timeline items={timelineItems} />
        </div>
        <div className="glass-panel space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-white">Execution phases</h2>
          <ul className="space-y-3 text-[rgba(248,244,246,0.85)]">
            {executionPhases.map((phase) => (
              <li key={phase.title} className="rounded-lg border border-border/70 bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-sm font-semibold text-white">{phase.title}</p>
                <p className="text-sm text-[rgba(248,244,246,0.75)]">{phase.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-white">Workshop &amp; Briefing Itinerary</h2>
            <span className="badge-soft">25th April 2026</span>
          </div>
          <details className="mt-4 rounded-lg border border-border/70 bg-[rgba(255,255,255,0.02)] p-4" open>
            <summary className="cursor-pointer text-sm font-semibold text-white">View schedule</summary>
            <ul className="mt-3 space-y-2 text-sm text-[rgba(248,244,246,0.85)]">
              {workshopSchedule.map((slot) => (
                <li key={slot.time} className="flex justify-between gap-4 rounded-md border border-border/50 bg-[rgba(255,255,255,0.02)] px-3 py-2">
                  <span className="font-semibold text-white">{slot.time}</span>
                  <span>{slot.item}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-white">Grand Final Itinerary</h2>
            <span className="badge-soft">6th June 2026</span>
          </div>
          <p className="mt-2 text-sm text-[rgba(248,244,246,0.85)]">
            Grand Final held physically. Six teams shortlisted from the Preliminary Round present models,
            scenario analyses, strategies and data visualisations. Each team: 15 minutes presentation + 10
            minutes Q&amp;A.
          </p>
          <details className="mt-4 rounded-lg border border-border/70 bg-[rgba(255,255,255,0.02)] p-4" open>
            <summary className="cursor-pointer text-sm font-semibold text-white">View schedule</summary>
            <ul className="mt-3 space-y-2 text-sm text-[rgba(248,244,246,0.85)]">
              {grandFinalSchedule.map((slot) => (
                <li key={slot.time} className="flex justify-between gap-4 rounded-md border border-border/50 bg-[rgba(255,255,255,0.02)] px-3 py-2">
                  <span className="font-semibold text-white">{slot.time}</span>
                  <span>{slot.item}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
