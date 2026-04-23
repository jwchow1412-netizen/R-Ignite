"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { forumAnnouncements } from "@/lib/forum-data";
import { type ForumPost, toggleLikeAction, addComment, deleteComment } from "@/app/actions/forum";

export type ForumComment = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

type TabId = "highlights" | "announcements";

export default function ForumClient({ 
  initialPosts, 
  initialComments,
  isAdmin 
}: { 
  initialPosts: ForumPost[],
  initialComments: ForumComment[],
  isAdmin?: boolean
}) {
  const [activeTab, setActiveTab] = useState<TabId>("highlights");
  
  // Real backend like toggle handling
  const [isPending, startTransition] = useTransition();
  // We keep an optimistic view of likes
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, number>>(
    Object.fromEntries(initialPosts.map((post) => [post.id, post.likes]))
  );
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Expansion State
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  
  // Comment Form State
  const [commentText, setCommentText] = useState("");

  const handleLike = (post: ForumPost) => {
    if (isPending) return;
    const isCurrentlyLiked = likedPosts[post.id] || false;
    const currentLikes = optimisticLikes[post.id] || 0;
    
    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
    setOptimisticLikes((prev) => ({
      ...prev,
      [post.id]: prev[post.id] + (!isCurrentlyLiked ? 1 : -1),
    }));

    startTransition(async () => {
       try {
           await toggleLikeAction(post.id, currentLikes, !isCurrentlyLiked);
       } catch (err) {
           console.error(err);
           // Revert on error
           setLikedPosts((prev) => ({ ...prev, [post.id]: isCurrentlyLiked }));
           setOptimisticLikes((prev) => ({ ...prev, [post.id]: currentLikes }));
       }
    });
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
      e.preventDefault();
      if (!commentText.trim() || isPending) return;
      const text = commentText;
      setCommentText("");
      startTransition(async () => {
          try {
              await addComment(postId, text);
          } catch {
              alert("Failed to add comment. Please log in first.");
          }
      });
  };

  const handleDeleteComment = (e: React.MouseEvent, commentId: string) => {
      e.stopPropagation();
      if (!confirm("Permanently delete this comment?")) return;
      startTransition(async () => {
          try {
              await deleteComment(commentId);
          } catch(err: unknown) {
              alert((err as Error).message);
          }
      });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 flex flex-col md:flex-row gap-6 md:gap-8 min-h-[85vh]">
      
      {/* Left Sidebar Navigation (Sharp Tech Editorial Redesign) */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6 font-mono border-r border-[#F89924]/20 pr-6">
        <div className="p-6 flex flex-col items-start justify-center border-l-4 border-[#F89924] bg-white/5 relative overflow-hidden">
          <div className="relative h-16 w-16 mb-4">
            <Image src="/logo.svg" alt="R-Ignite Logo" fill className="object-contain" />
          </div>
          <h2 className="text-xl font-black tracking-widest text-[#F89924] uppercase">SYS_FORUM</h2>
          <p className="text-xs text-white/40 mt-1 uppercase">v2.1.0 Intel Feed</p>
        </div>

        <nav className="flex md:flex-col gap-3 pb-2 md:pb-0 items-start w-full">
          <button
            onClick={() => setActiveTab("highlights")}
            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 font-bold tracking-wide text-sm uppercase ${
              activeTab === "highlights" 
                ? "bg-[#D46476] text-white shadow-[4px_4px_0_0_#F89924]"
                : "border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>[01] Intel</span>
            <span>+</span>
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-300 font-bold tracking-wide text-sm uppercase ${
              activeTab === "announcements" 
                ? "bg-[#D46476] text-white shadow-[4px_4px_0_0_#F89924]"
                : "border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>[02] Updates</span>
            <span>+</span>
          </button>
        </nav>

        <div className="mt-auto hidden md:block pt-8 space-y-4">
           <Link 
              href="/rewards" 
              className="text-white/40 hover:text-[#F89924] text-xs uppercase tracking-widest font-semibold flex items-center justify-between w-full border-t border-white/10 pt-4 transition-colors select-none"
           >
              Legacy Portal <span>→</span>
           </Link>
           <Link 
              href="/forum/admin" 
              className="text-[#D46476] hover:text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-between w-full transition-colors select-none"
           >
              Admin Sys Access <span>→</span>
           </Link>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 relative overflow-visible">
         <div className="relative z-10 w-full h-full min-h-[600px] border-t-2 md:border-t-0 md:border-l-2 border-white/5 md:pl-8 py-4">
            <AnimatePresence mode="wait">
              {activeTab === "highlights" && (
                 <motion.div
                    key="highlights"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                 >
                    <div className="flex justify-between items-end pb-2 mb-6 border-b-2 border-white/20">
                       <h3 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                           Field Intel
                           {isAdmin && (
                               <Link href="/forum/admin" className="text-[#10B981] hover:bg-[#10B981] hover:text-black border border-[#10B981] w-8 h-8 flex items-center justify-center font-mono text-xl transition-colors shrink-0" title="Manage Intel">
                                   +
                               </Link>
                           )}
                       </h3>
                       <span className="text-[#F89924] text-xs font-mono font-bold tracking-widest hidden sm:block">LIVE_FEED_SYNCED</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       {initialPosts.length === 0 ? (
                          <div className="col-span-full border border-dashed border-white/20 p-12 text-center text-white/50 font-mono uppercase text-sm">
                              NO DATA BLOCKS FOUND. ADMIN UPLOAD REQUIRED.
                          </div>
                       ) : initialPosts.map((post) => (
                          <motion.div 
                             layoutId={`post-${post.id}`}
                             key={post.id} 
                             onClick={() => setSelectedPost(post)}
                             className="bg-[#120a14] border border-white/10 hover:border-[#D46476] p-0 transition-colors cursor-pointer group flex flex-col h-[320px] shadow-lg"
                          >
                             {/* Image Header */}
                             <motion.div layoutId={`image-${post.id}`} className="w-full h-40 overflow-hidden relative border-b border-white/10 bg-black">
                                <Image src={post.image_url} alt={post.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" unoptimized />
                                {post.is_new && (
                                   <div className="absolute top-0 right-0 bg-[#F89924] text-black text-[10px] font-black uppercase px-2 py-1 tracking-widest z-20">NEW</div>
                                )}
                             </motion.div>
                             
                             {/* Content Meta */}
                             <div className="p-5 flex-1 flex flex-col">
                                <motion.div layoutId={`tags-${post.id}`} className="flex gap-2 mb-3 overflow-hidden">
                                   {Array.isArray(post.tags) && post.tags.slice(0,2).map(tag => (
                                      <span key={tag} className="bg-white/5 text-[#D46476] px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">{tag}</span>
                                   ))}
                                </motion.div>
                                <motion.h4 layoutId={`title-${post.id}`} className="text-lg font-black text-white leading-tight mb-2 group-hover:text-[#F89924] transition-colors line-clamp-2">
                                   {post.title}
                                </motion.h4>
                                <motion.div layoutId={`snippet-${post.id}`} className="text-[rgba(248,244,246,0.6)] text-xs leading-relaxed line-clamp-2 font-mono mt-auto overflow-hidden whitespace-pre-wrap 
                                  [&_strong]:text-white [&_strong]:font-black [&_em]:italic [&_em]:text-white 
                                  [&_a]:text-[#F89924] [&_a]:underline"
                                >
                                   <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{post.snippet}</ReactMarkdown>
                                </motion.div>
                             </div>
                             
                             {/* Bottom Bar Footer */}
                             <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02] relative">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-none bg-white/20 relative overflow-hidden">
                                        <Image src="/logo.svg" alt="author" fill className="object-cover" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate max-w-[100px]">{post.author}</span>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    {isAdmin && (
                                        <Link 
                                            href="/forum/admin" 
                                            onClick={(e) => e.stopPropagation()} 
                                            className="text-[#10B981] hover:text-[#059669] text-[10px] uppercase font-black tracking-widest z-20 tooltip"
                                            title="Manage in Admin Portal"
                                        >
                                            EDIT
                                        </Link>
                                    )}
                                    <div className="text-[10px] font-mono text-[#D46476] group-hover:text-white/80 transition-colors uppercase">
                                        EXPAND ↗
                                    </div>
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </motion.div>
              )}

              {activeTab === "announcements" && (
                 <motion.div
                    key="announcements"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                 >
                    {/* Main Hero Poster - Angular Redesign */}
                    <div className="relative w-full h-[300px] md:h-[400px] border-2 border-white/10 group shadow-2xl bg-black">
                       <Image src={forumAnnouncements.hero.imageUrl} alt="Event Hero Poster" fill className="object-cover opacity-60 mix-blend-luminosity" />
                       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                       
                       <div className="absolute top-0 left-0 border-b-2 border-r-2 border-[#D46476] bg-black/50 backdrop-blur-md px-6 py-3">
                           <div className="text-[#D46476] text-xs font-black uppercase tracking-widest">OFFICIAL_BROADCAST</div>
                       </div>

                       <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
                          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-wide border-l-4 border-[#F89924] pl-4">{forumAnnouncements.hero.title}</h2>
                          <p className="text-[rgba(248,244,246,0.85)] md:text-lg max-w-xl font-mono text-sm leading-relaxed bg-black/40 p-4 border border-white/10 backdrop-blur-sm">{forumAnnouncements.hero.subtitle}</p>
                       </div>
                    </div>

                    {/* Announcement Info List (instead of Grid) */}
                    <div className="flex flex-col gap-4 mt-4">
                       {forumAnnouncements.items.map((item, i) => (
                          <div key={item.id} className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 hover:border-white/30 transition-all flex flex-col md:flex-row md:items-center gap-6 group relative">
                             <div className="text-4xl text-white/20 group-hover:text-[#F89924] transition-colors font-mono">0{i + 1}</div>
                             <div className="flex-1">
                                <h4 className="text-xl font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                                    {item.title} 
                                    <span className="text-lg">{item.icon}</span>
                                </h4>
                                <p className="text-sm font-mono text-white/50">{item.snippet}</p>
                             </div>
                             
                             {item.linkText && item.embedLink && (
                                <div className="flex flex-col gap-2 relative shrink-0">
                                    {item.isMap ? (
                                        <div className="relative group">
                                            <Link href={item.embedLink} target="_blank" className="bg-[#D46476] hover:bg-[#F89924] text-black font-black text-xs uppercase tracking-widest px-6 py-3 transition-colors block text-center min-w-[150px]">
                                                {item.linkText} <span className="ml-2 font-mono">→</span>
                                            </Link>
                                            <div className="absolute bottom-full right-0 mb-4 w-[300px] bg-[#0e080f] border border-[rgba(248,153,36,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-[0_0_30px_rgba(248,153,36,0.2)] p-2 hidden md:block">
                                                <iframe 
                                                    src="https://maps.google.com/maps?q=UCSI%20University,%20Kuala%20Lumpur&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                                    width="100%" 
                                                    height="200" 
                                                    style={{ border: 0 }} 
                                                    allowFullScreen={false} 
                                                    loading="lazy" 
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                ></iframe>
                                                <p className="text-xs text-center text-[#F89924] font-black uppercase tracking-widest mt-2">{item.title}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={item.embedLink} className="border border-[#F89924] text-[#F89924] hover:bg-[#F89924] hover:text-black font-black text-xs uppercase tracking-widest px-6 py-3 transition-colors block text-center min-w-[150px]">
                                            {item.linkText} <span className="ml-2 font-mono">→</span>
                                        </Link>
                                    )}
                                    
                                    {/* Secondary Action */}
                                    {(item as Record<string, string|boolean|undefined>).secondaryLinkText && (item as Record<string, string|boolean|undefined>).secondaryEmbedLink && (
                                        <Link href={(item as Record<string, string|boolean|undefined>).secondaryEmbedLink as string} target="_blank" className="border border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-black text-xs uppercase tracking-widest px-6 py-3 transition-colors block text-center min-w-[150px]">
                                            {(item as Record<string, string|boolean|undefined>).secondaryLinkText as string} <span className="ml-2 font-mono">→</span>
                                        </Link>
                                    )}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* EXPANDED POST MODAL / FLIPBOOK ANIMATION */}
      <AnimatePresence>
        {selectedPost && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                    className="fixed inset-0 bg-[#0e080f]/90 backdrop-blur-sm z-40" 
                    onClick={() => setSelectedPost(null)} 
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
                    <motion.div 
                        layoutId={`post-${selectedPost.id}`} 
                        className="bg-[#120a14] border border-white/20 w-full max-w-5xl md:h-[80vh] flex flex-col md:flex-row shadow-[0_0_50px_rgba(212,100,118,0.2)] rounded-sm pointer-events-auto overflow-hidden relative"
                    >
                        {/* CLOSE BTN */}
                        <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 z-50 text-white hover:text-[#D46476] bg-black/50 p-2 border border-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left Side: Editorial Image */}
                        <motion.div layoutId={`image-${selectedPost.id}`} className="w-full md:w-2/5 h-64 md:h-full relative bg-black shrink-0 border-b md:border-b-0 md:border-r border-white/10">
                            <Image src={selectedPost.image_url} alt={selectedPost.title} fill className="object-cover opacity-80" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            
                            <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-2">
                                <motion.div layoutId={`tags-${selectedPost.id}`} className="flex flex-wrap gap-2">
                                    {Array.isArray(selectedPost.tags) && selectedPost.tags.map(tag => (
                                        <span key={tag} className="bg-white/10 backdrop-blur-md text-[#F89924] border border-[#F89924]/30 px-3 py-1 text-xs uppercase font-black tracking-widest">{tag}</span>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Side: Scrollable Content & Discussion */}
                        <div className="flex-1 flex flex-col h-full bg-[rgba(14,8,15,0.9)] overflow-hidden">
                            {/* Header Info */}
                            <div className="p-6 md:p-10 border-b border-white/10">
                                <div className="text-[#D46476] font-mono text-xs mb-3 uppercase tracking-widest">Post Id: {selectedPost.id.split('-')[0]} {'//'} Auth: {selectedPost.author}</div>
                                <motion.h4 layoutId={`title-${selectedPost.id}`} className="text-3xl md:text-4xl font-black text-white leading-tight uppercase">
                                    {selectedPost.title}
                                </motion.h4>
                            </div>

                            {/* Main Body Scrolling */}
                            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 pb-32">
                                <motion.div layoutId={`snippet-${selectedPost.id}`} className="text-[rgba(248,244,246,0.85)] text-base md:text-lg leading-relaxed font-serif whitespace-pre-wrap
                                  [&_strong]:text-white [&_strong]:font-black [&_em]:italic [&_em]:text-[#D46476] 
                                  [&_a]:text-[#F89924] [&_a]:underline"
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{selectedPost.snippet}</ReactMarkdown>
                                </motion.div>

                                {/* Comments Section Divider */}
                                <div className="mt-16 mb-8 border-t border-white/10 relative">
                                    <span className="absolute top-0 left-0 -translate-y-1/2 bg-[#120a14] pr-4 text-[#F89924] font-black uppercase tracking-widest text-sm">Transmission Log //</span>
                                </div>
                                
                                {/* Comments List */}
                                <div className="space-y-6">
                                    {initialComments.filter(c => c.post_id === selectedPost.id).length === 0 ? (
                                        <p className="text-white/30 font-mono text-xs">No active discussions. Be the first to initialize.</p>
                                    ) : (
                                        initialComments.filter(c => c.post_id === selectedPost.id).map(comment => (
                                            <div key={comment.id} className="border-l-2 border-white/10 pl-4 py-1 relative group pr-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-bold text-white tracking-widest uppercase">{comment.author_name}</span>
                                                    <span className="text-[10px] text-white/30 font-mono">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                                
                                                {isAdmin && (
                                                    <button 
                                                        onClick={(e) => handleDeleteComment(e, comment.id)}
                                                        className="absolute top-1/2 -translate-y-1/2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-500"
                                                        title="Delete Comment"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Bottom Fixed Action Bar */}
                            <div className="p-4 md:p-6 border-t border-white/10 bg-[#0e080f] flex items-center gap-4">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleLike(selectedPost); }}
                                    className={`flex items-center gap-3 px-6 py-3 border transition-colors shrink-0 font-bold tracking-widest uppercase text-sm ${likedPosts[selectedPost.id] ? "bg-[#D46476]/10 text-[#D46476] border-[#D46476]" : "border-white/20 text-white hover:border-[#D46476] hover:text-[#D46476]"}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    {optimisticLikes[selectedPost.id] || 0}
                                </button>
                                
                                <form onSubmit={(e) => handleAddComment(e, selectedPost.id)} className="flex-1 flex w-full relative">
                                    <input 
                                        type="text" 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Transmit input..." 
                                        className="w-full bg-transparent border border-white/20 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#F89924] transition-colors pr-24"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!commentText.trim() || isPending}
                                        className="absolute right-1 top-1 bottom-1 px-4 bg-white/10 hover:bg-[#F89924] hover:text-black text-white text-xs font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}
