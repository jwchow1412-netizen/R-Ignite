"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createForumPost, deleteForumPost, updateForumPost, type ForumPost } from "@/app/actions/forum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ForumAdminClient({ initialPosts, adminName }: { initialPosts: ForumPost[], adminName: string }) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Organising Committee");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("/logo.svg");
  const [snippet, setSnippet] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (editingId) {
            await updateForumPost(editingId, formData);
            setSuccessMsg("Post successfully updated!");
        } else {
            await createForumPost(formData);
            setSuccessMsg("Post completely integrated into framework!");
        }
        
        // Reset local form
        setEditingId(null);
        setTitle("");
        setSnippet("");
        setTags("");
        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (err: unknown) {
        alert((err as Error).message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;
    startTransition(async () => {
        try {
            await deleteForumPost(id);
            if (editingId === id) cancelEdit();
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    });
  };

  const handleEdit = (post: ForumPost) => {
      setEditingId(post.id);
      setTitle(post.title);
      setAuthor(post.author);
      setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
      setImageUrl(post.image_url);
      setSnippet(post.snippet);
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
      setEditingId(null);
      setTitle("");
      setAuthor("Organising Committee");
      setTags("");
      setImageUrl("/logo.svg");
      setSnippet("");
  };

  const previewTags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10">
        <p className="text-[#F89924] font-bold tracking-widest uppercase text-sm mb-2">
          Admin Portal
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Forum Intel</h1>
        <p className="text-[rgba(248,244,246,0.7)]">
          Logged in as <strong>{adminName}</strong>. 
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Pane: Form */}
        <div className="glass-panel p-8 md:p-10 relative overflow-hidden h-fit">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                {editingId ? "Edit Intel Post" : "Draft New Post"}
            </h3>
            {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[#10B981] text-[#10B981] font-bold animate-in slide-in-from-top-2">
                    {successMsg}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input id="title" name="title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Major Takeaways from the Workshop" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="author" className="text-white">Author Display Name</Label>
                    <Input id="author" name="author" required value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Organising Committee" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags" className="text-white">Tags (comma separated)</Label>
                    <Input id="tags" name="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. #WorkshopRecap, #Speaker" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-white">Cover Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="e.g. /Forum/hero.jpg or full URL" className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="snippet" className="text-white">Content Snippet (Markdown & HTML Supported)</Label>
                    <Textarea 
                        id="snippet" 
                        name="snippet" 
                        required 
                        value={snippet}
                        onChange={e => setSnippet(e.target.value)}
                        placeholder="Write your summary here... Supports **bold**, *italic*, or HTML like <span style='color:red'>colored text</span>" 
                        className="min-h-[120px] bg-white/5 border-white/10 text-white" 
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <Button type="submit" disabled={isPending} className="flex-1 h-12 bg-gradient-to-r from-[#D46476] to-[#F89924] text-white font-bold tracking-wide">
                        {isPending ? "Processing..." : (editingId ? "Update Post" : "Publish Post")}
                    </Button>
                    {editingId && (
                        <Button type="button" variant="outline" onClick={cancelEdit} disabled={isPending} className="h-12 border-white/20 text-white hover:bg-white/10">
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white mb-2">Live Preview</h3>
            <div className="p-1 rounded-3xl bg-[rgba(14,8,15,0.6)] border border-white/5 shadow-2xl relative overflow-hidden flex-1">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(212,100,118,0.1)] rounded-full blur-3xl opacity-50" />
                <div className="px-6 py-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-[#F89924] text-black text-xs font-bold px-3 py-1 rounded-bl-xl z-20">NEW</div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#F89924] transition-colors">{title || "Your Title Here"}</h4>
                                <div className="flex gap-2 mb-3">
                                    {previewTags.length > 0 ? previewTags.map(tag => (
                                        <span key={tag} className="text-[#D46476] text-xs font-semibold">{tag}</span>
                                    )) : (
                                        <span className="text-[#D46476] text-xs font-semibold">#PreviewTag</span>
                                    )}
                                </div>
                                <p className="text-[rgba(248,244,246,0.8)] text-sm leading-relaxed mb-6">
                                    {snippet || "Your descriptive content snippet will appear here..."}
                                </p>
                                
                                <div className="flex items-center gap-6 text-sm font-semibold text-white/50 border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-3">
                                        <Image src="/logo.svg" alt="author" width={24} height={24} className="rounded-full bg-white/10" />
                                        <span>{author || "Author Name"}</span>
                                    </div>
                                    <div className="flex-1" />
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                        0
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10 relative bg-black/40">
                                {imageUrl && (
                                    <Image src={imageUrl} alt="preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Pane: Existing Posts */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Manage Active Intel</h3>
        {initialPosts.length === 0 ? (
            <p className="text-white/50">No intel posts have been created yet.</p>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialPosts.map(post => (
                    <div key={post.id} className="glass-panel p-5 relative border border-white/10 hover:border-white/20 transition-colors flex flex-col items-start">
                        <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{post.title}</h4>
                        <p className="text-sm text-white/50 mb-4">By {post.author}</p>
                        
                        <div className="flex-1"></div>
                        
                        <div className="flex items-center gap-3 w-full">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(post)}
                                disabled={isPending}
                                className="flex-1 border-white/20 text-white hover:border-[#F89924] hover:text-[#F89924]"
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleDelete(post.id)}
                                disabled={isPending}
                                className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
