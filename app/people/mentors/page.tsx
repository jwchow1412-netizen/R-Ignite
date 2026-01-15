import PersonCard from "@/components/PersonCard";

export const metadata = {
  title: "Mentors | MASA Hackathon 2026: R-Ignite",
};

const placeholders = Array.from({ length: 3 }, (_, index) => ({
  name: "To Be Announced",
  role: `Mentor ${index + 1}`,
  status: "Coming Soon",
}));

export default function MentorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          People
        </p>
        <h1 className="text-4xl font-bold text-white">Mentors</h1>
        <p className="text-lg text-[rgba(248,244,246,0.85)]">Profiles will be added once announced.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {placeholders.map((person) => (
          <PersonCard key={person.role} {...person} />
        ))}
      </div>
    </div>
  );
}
