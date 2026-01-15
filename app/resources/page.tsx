import ResourceDownloadCard from "@/components/ResourceDownloadCard";

export const metadata = {
  title: "Resources | MASA Hackathon 2026: R-Ignite",
};

const resources = [
  {
    title: "Participant Handbook",
    href: "/downloads/handbook.pdf",
    description: "Competition overview and guidance. Replace this placeholder PDF with the official handbook.",
  },
  {
    title: "Problem Statement",
    href: "/downloads/problem-statement.pdf",
    description: "Problem statement will be announced soon. Current file is a placeholder.",
    comingSoon: true,
  },
  {
    title: "Judging Rubric",
    href: "/downloads/rubric.pdf",
    description: "Judging criteria and scoring breakdown. Placeholder until final rubric is released.",
    comingSoon: true,
  },
  {
    title: "Terms & Conditions",
    href: "/downloads/terms-and-conditions.pdf",
    description: "Participant obligations and policies. Placeholder until official terms are published.",
    comingSoon: true,
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          Resources
        </p>
        <h1 className="text-4xl font-bold text-white">Download centre</h1>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <ResourceDownloadCard key={resource.title} {...resource} />
        ))}
      </div>

      <div className="mt-12 glass-panel p-6">
        <h2 className="text-2xl font-semibold text-white">Need something else?</h2>
        <p className="mt-2 text-[rgba(248,244,246,0.85)]">
          For clarifications, reach out to hackathon@masassociation.org. Updates to the topic and resources
          will be added here.
        </p>
      </div>
    </div>
  );
}
