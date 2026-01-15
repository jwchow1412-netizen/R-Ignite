const faqs = [
  {
    question: "What is MASA Hackathon 2026: R-Ignite?",
    answer:
      "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. It is a two-month event offering Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems, gain hands-on experience, enhance analytical skills, and network with industry professionals.",
  },
  {
    question: "Who is organising the hackathon?",
    answer: "The Malaysian Actuarial Student Association (MASA) is organising the event.",
  },
  {
    question: "What is the current focus track?",
    answer:
      "The temporary focus track is Cybersecurity Risk. The topic is subject to change and final details will be announced.",
  },
  {
    question: "What is the high-level process?",
    answer:
      "Phases include Registration, Pre-Event Briefing and Workshop, Preliminary Round, Judging & Shortlisting, and the Grand Final. Participants work with an insurance-related dataset and learn data preprocessing during the workshop, then build predictive models, generate reports, and create visualisations. Top 6 teams are shortlisted to proceed to the Grand Final and present to judges.",
  },
  {
    question: "What are the key dates?",
    answer:
      "Registration runs 3rd – 23rd April 2026. Hackathon commences 24th April 2026. Workshop and Briefing is 25th April 2026. Preliminary Round submission is 7th May 2026. Judging Period is 8th – 22nd May 2026. Finalists announcement is 24th May 2026. Grand Final presentation is 6th June 2026.",
  },
  {
    question: "How is the Grand Final conducted?",
    answer:
      "The Grand Final is held physically. Six teams shortlisted from the Preliminary Round present models, scenario analyses, strategies and data visualisations. Each team has 15 minutes presentation plus 10 minutes Q&A.",
  },
  {
    question: "How do I get more information?",
    answer:
      "Resources will be updated under the Downloads section. For enquiries, email hackathon@masassociation.org. Registration and topic details marked Coming Soon will be published when ready.",
  },
];

export const metadata = {
  title: "FAQ | MASA Hackathon 2026: R-Ignite",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          FAQ
        </p>
        <h1 className="text-4xl font-bold text-white">Answers at a glance</h1>
      </div>

      <div className="mt-10 space-y-4">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-4"
          >
            <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-white">
              {item.question}
              <span className="text-sm text-[rgba(248,244,246,0.65)] transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-2 text-[rgba(248,244,246,0.85)]">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
