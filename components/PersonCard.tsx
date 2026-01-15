import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type PersonCardProps = {
  name: string;
  role: string;
  status?: string;
  image?: string;
  linkedin?: string;
};

export default function PersonCard({ name, role, status, image, linkedin }: PersonCardProps) {
  const hasLinkedIn = Boolean(linkedin);
  const imageSrc = image ?? "/team/placeholder.svg";
  const imageAlt = image ? `${name} headshot` : `${name} placeholder`;

  return (
    <div className="glass-panel flex h-full flex-col items-center gap-4 p-4 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(212,100,118,0.3)] hover:border-[rgba(212,100,118,0.3)]">
      <div className="flex justify-center">
        <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.08)] shadow-[0_0_0_10px_rgba(212,100,118,0.06)] transition-colors duration-300 group-hover:border-[rgba(212,100,118,0.6)]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="160px"
            className="object-cover object-[center_35%]"
            priority={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.08em] text-[rgba(248,244,246,0.7)]">{role}</p>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {status ? (
          <p className="text-sm text-[rgba(248,244,246,0.75)]">{status}</p>
        ) : null}
      </div>
      <div className="flex w-full gap-2">
        {hasLinkedIn ? (
          <Button asChild variant="linkedin" className="w-full justify-center">
            <Link href={linkedin as string}>
              LinkedIn
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            variant="secondary"
            className="w-full justify-center cursor-not-allowed opacity-60"
            aria-disabled
          >
            LinkedIn (Coming Soon)
          </Button>
        )}
      </div>
    </div>
  );
}
