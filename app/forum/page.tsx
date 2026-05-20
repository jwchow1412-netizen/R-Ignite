import ForumClient from "@/components/ForumClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Forum | MASA Hackathon 2026: R-Ignite",
};

// Next.js config to ensure the page caches but is re-evaluated when revalidatePath runs
export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const supabase = createClient();

  // Fetch dynamic intel posts from the newly created database table if it exists.
  // Suppress errors about table not existing, they will just return null and use an empty array.
  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("forum_comments")
    .select("*")
    .order("created_at", { ascending: true });

  const initialPosts = posts ?? [];
  const initialComments = comments ?? [];

  // Check if current user is admin
  let isAdmin = false;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile && profile.role === "admin") isAdmin = true;
  }

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

      <div className="relative z-10">
        <ForumClient initialPosts={initialPosts} initialComments={initialComments} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
