import Timeline from "@/components/Timeline";
import ItineraryTabs from "@/components/ItineraryTabs";
import { timelineItems } from "@/lib/data";

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
      </div>

      <div className="mt-10 space-y-6">
        <Timeline items={timelineItems} />
      </div>

      <ItineraryTabs />
    </div>
  );
}
