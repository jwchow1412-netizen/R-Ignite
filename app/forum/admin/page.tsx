import { requireAdminRewardsUser } from "@/lib/rewards-server";
import { createClient } from "@/utils/supabase/server";
import ForumAdminClient from "@/components/ForumAdminClient";

export const metadata = {
  title: "Forum Admin | MASA Hackathon",
};

export const dynamic = "force-dynamic";

export default async function ForumAdminPage() {
  const { profile } = await requireAdminRewardsUser("/forum/admin");
  const supabase = createClient();
  
  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full relative">
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: "url('/background.svg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }} 
      />
      <div className="relative z-10 w-full min-h-screen">
        <ForumAdminClient initialPosts={posts ?? []} adminName={profile.full_name ?? "Admin"} />
      </div>
    </div>
  );
}
