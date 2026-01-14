import Link from "next/link";

export const metadata = {
  title: "Register | MASA Hackathon 2026: R-Ignite",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          Register
        </p>
        <h1 className="text-4xl font-bold text-white">Register Interest</h1>
        <p className="max-w-4xl text-lg text-[rgba(248,244,246,0.85)]">
          Registration links will be released soon. The registration period is 3rd – 23rd April 2026. Use the
          button below as a placeholder to signal interest and check back for updates.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:w-2/3">
        <Link
          href="#"
          className="btn-primary justify-center cursor-not-allowed opacity-80"
          aria-disabled
          onClick={(event) => event.preventDefault()}
        >
          Register Interest (Coming Soon)
        </Link>
        <div className="rounded-lg border border-border bg-[rgba(255,255,255,0.02)] p-4 text-sm text-[rgba(248,244,246,0.85)]">
          <p className="font-semibold text-white">Key dates</p>
          <ul className="mt-2 space-y-2">
            <li>3rd – 23rd April 2026: Registration</li>
            <li>24th April 2026: Hackathon Commencement</li>
            <li>25th April 2026: Hackathon Workshop and Briefing</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.1)] p-4 text-sm text-[rgba(248,244,246,0.9)]">
          Need help? Email{" "}
          <Link href="mailto:hackathon@masassociation.org" className="underline">
            hackathon@masassociation.org
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
