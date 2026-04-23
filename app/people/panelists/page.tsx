import PersonCard from "@/components/PersonCard";
import { panelists } from "@/lib/data";

export const metadata = {
  title: "Panelists | MASA Hackathon 2026: R-Ignite",
};

export default function PanelistsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          People
        </p>
        <h1 className="text-4xl font-bold text-white">Panelists</h1>
        <p className="text-lg text-[rgba(248,244,246,0.85)]">Professionals diving deep into discussion panels.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {panelists.map((person) => (
          <PersonCard key={person.name} {...person} />
        ))}
      </div>
    </div>
  );
}
