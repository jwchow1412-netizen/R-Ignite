// This component stays a Server Component; avoid client handlers for static generation.
import Image from "next/image";
import Link from "next/link";

type PersonCardProps = {
  name: string;
  role: string;
  status?: string;
  linkedin?: string;
};

export default function PersonCard({ name, role, status, linkedin }: PersonCardProps) {
  const hasLinkedIn = Boolean(linkedin);

  return (
    <div className="glass-panel flex flex-col gap-4 p-4">
      <div className="overflow-hidden rounded-xl border border-border/70">
        <Image
          src="/team/placeholder.svg"
          alt={`${name} placeholder`}
          width={420}
          height={320}
          className="h-52 w-full object-cover"
          priority={false}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.08em] text-[rgba(248,244,246,0.6)]">
          {role}
        </p>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {status ? (
          <p className="text-sm text-[rgba(248,244,246,0.75)]">{status}</p>
        ) : null}
      </div>
      <div className="flex gap-2">
        {hasLinkedIn ? (
          <Link href={linkedin as string} className="btn-secondary w-full justify-center">
            LinkedIn
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="btn-secondary w-full justify-center cursor-not-allowed opacity-60"
            aria-disabled
          >
            LinkedIn (Coming Soon)
          </button>
        )}
      </div>
    </div>
  );
}
