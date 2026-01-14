import Link from "next/link";

type ResourceDownloadCardProps = {
  title: string;
  description?: string;
  href: string;
  comingSoon?: boolean;
};

export default function ResourceDownloadCard({
  title,
  description,
  href,
  comingSoon,
}: ResourceDownloadCardProps) {
  return (
    <div className="glass-panel flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-[rgba(248,244,246,0.8)]">{description}</p>
          ) : null}
        </div>
        {comingSoon ? (
          <span className="badge-soft whitespace-nowrap text-xs">Coming Soon</span>
        ) : null}
      </div>
      <Link
        href={href}
        className={`btn-secondary w-full justify-center ${comingSoon ? "opacity-70" : ""}`}
        download
      >
        Download
      </Link>
    </div>
  );
}
