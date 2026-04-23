"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type ForumPost = {
  id: string;
  title: string;
  snippet: string;
  author: string;
  tags: string[];
  image_url: string;
  likes: number;
  comments: number;
  is_new: boolean;
  created_at: string;
};

export async function createForumPost(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Permission denied. Must be an admin.");
  }

  const title = formData.get("title") as string;
  const snippet = formData.get("snippet") as string;
  const author = formData.get("author") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const rawTags = formData.get("tags") as string;
  const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("forum_posts").insert({
    title,
    snippet,
    author,
    image_url: imageUrl,
    tags,
  });

  if (error) {
    console.error("Error inserting forum post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/forum");
}

export async function updateForumPost(postId: string, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") throw new Error("Permission denied. Must be an admin.");

  const title = formData.get("title") as string;
  const snippet = formData.get("snippet") as string;
  const author = formData.get("author") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const rawTags = formData.get("tags") as string;
  const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("forum_posts").update({
    title,
    snippet,
    author,
    image_url: imageUrl,
    tags,
  }).eq("id", postId);

  if (error) {
    console.error("Error updating forum post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/forum");
  revalidatePath("/forum/admin");
}

export async function toggleLikeAction(postId: string, currentLikes: number, isLiking: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const newLikes = isLiking ? currentLikes + 1 : Math.max(0, currentLikes - 1);
  const { error } = await supabase.from("forum_posts").update({ likes: newLikes }).eq("id", postId);
  
  if (error) {
    console.error("Error toggling like:", error);
    throw new Error(error.message);
  }
  revalidatePath("/forum");
}

export async function addComment(postId: string, content: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Insert comment
  const { error } = await supabase.from("forum_comments").insert({
    post_id: postId,
    author_id: user.id,
    author_name: profile.full_name,
    content: content
  });

  if (error) {
    console.error("Error adding comment:", error);
    throw new Error(error.message);
  }

  // Increment denormalized comment count
  const { data: post } = await supabase.from("forum_posts").select("comments").eq("id", postId).single();
  if (post) {
      await supabase.from("forum_posts").update({ comments: (post.comments || 0) + 1 }).eq("id", postId);
  }

  revalidatePath("/forum");
}

export async function deleteForumPost(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Permission denied. Must be an admin.");
  }

  const { error } = await supabase.from("forum_posts").delete().eq("id", postId);

  if (error) {
    console.error("Error deleting forum post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/forum");
  revalidatePath("/forum/admin");
}

export async function deleteComment(commentId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") throw new Error("Permission denied.");

  const { data: comment } = await supabase.from("forum_comments").select("post_id").eq("id", commentId).single();
  if (!comment) return;

  const { error } = await supabase.from("forum_comments").delete().eq("id", commentId);
  if (error) throw new Error(error.message);

  const { data: post } = await supabase.from("forum_posts").select("comments").eq("id", comment.post_id).single();
  await supabase.from("forum_posts").update({ comments: Math.max(0, (post?.comments || 1) - 1) }).eq("id", comment.post_id);

  revalidatePath("/forum");
}
