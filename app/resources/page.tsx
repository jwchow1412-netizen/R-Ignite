import ResourceDownloadCard from "@/components/ResourceDownloadCard";

export const metadata = {
  title: "Resources | MASA Hackathon 2026: R-Ignite",
};

const resources = [
  {
    title: "Rules & Regulations (R&R)",
    href: "https://drive.google.com/file/d/1z6vmkkp9G7tRv9I1-Prd0tekPUpH7r-C/view?usp=sharing",
    description: "Competition overview, rules and guidance.",
  },
  {
    title: "Problem Statement",
    href: "/downloads/problem-statement.pdf",
    description: "Problem statement will be announced soon.",
    comingSoon: true,
  },
  {
    title: "Judging Rubric",
    href: "/downloads/rubric.pdf",
    description: "Judging criteria and scoring breakdown.",
    comingSoon: true,
  },
  {
    title: "Terms & Conditions",
    href: "https://drive.google.com/file/d/13VjUxeAlJNu46hBcpgBxLGzZ8bTsH_b-/view?usp=share_link",
    description: "Participant obligations and policies.",
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
