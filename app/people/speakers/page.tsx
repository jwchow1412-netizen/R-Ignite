import SpeakerSpotlight from "@/components/SpeakerSpotlight";
import { speakers } from "@/lib/data";

export const metadata = {
  title: "Speakers | MASA Hackathon 2026: R-Ignite",
};

export default function SpeakersPage() {
  const speaker = speakers[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)] animate-pulse">
          Knowledge Sharing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Meet Our Speaker</h1>
      </div>

      {speaker ? (
        <SpeakerSpotlight speaker={speaker} />
      ) : (
        <p className="mt-10 text-center text-white/50">Speaker information coming soon.</p>
      )}
    </div>
  );
}
