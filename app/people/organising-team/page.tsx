import Link from "next/link";
import PersonCard from "@/components/PersonCard";
import { organisingRoles } from "@/lib/data";

export const metadata = {
  title: "Organising Team | MASA Hackathon 2026: R-Ignite",
};

const categories = ["Chairperson", "Operation", "Corporate Relations", "Marketing"];

type PageProps = {
  searchParams?: {
    category?: string | string[];
  };
};

export default function OrganisingTeamPage({ searchParams }: PageProps) {
  const rawCategory = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : searchParams?.category;
  const selectedCategory =
    categories.find((category) => category.toLowerCase() === (rawCategory ?? "").toLowerCase()) ??
    categories[0];

  const filteredMembers = organisingRoles.filter((member) => member.category === selectedCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          People
        </p>
        <h1 className="text-4xl font-bold text-white">Organising Team</h1>
      </div>

      <div className="mt-8 rounded-3xl border border-border/80 bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            const href = `/people/organising-team?category=${encodeURIComponent(category)}`;

            return (
              <Link
                key={category}
                href={href}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[rgba(212,100,118,0.4)] bg-[rgba(212,100,118,0.15)] text-white shadow-[0_0_0_1px_rgba(212,100,118,0.12)]"
                    : "border-border/80 bg-[rgba(255,255,255,0.03)] text-[rgba(248,244,246,0.8)] hover:border-border"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t border-border/70 pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold text-white">{selectedCategory}</h2>
            <span className="text-sm text-[rgba(248,244,246,0.65)]">
              {filteredMembers.length} member{filteredMembers.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-6 mx-auto grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-items-center gap-6">
            {filteredMembers.map((member) => (
              <PersonCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
