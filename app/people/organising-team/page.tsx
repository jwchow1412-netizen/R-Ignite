import PersonCard from "@/components/PersonCard";
import { organisingRoles } from "@/lib/data";

export const metadata = {
  title: "Organising Team | MASA Hackathon 2026: R-Ignite",
};

export default function OrganisingTeamPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          People
        </p>
        <h1 className="text-4xl font-bold text-white">Organising Team</h1>
        <p className="text-lg text-[rgba(248,244,246,0.85)]">
          Team member names are not provided yet. Each role is listed with a placeholder photo and a LinkedIn
          button that will activate once links are supplied.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {organisingRoles.map((member) => (
          <PersonCard key={member.role} name={member.name} role={member.role} status="Coming Soon" />
        ))}
      </div>
    </div>
  );
}
