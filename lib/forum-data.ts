// We removed the static forumHighlights mock array. The Forum now pulls 'Intel' dynamically from the 'forum_posts' Supabase table.

export const forumAnnouncements = {
  hero: {
    id: "hero-1",
    title: "Win Big at R-Ignite's Lucky Draw! 🎡",
    subtitle: "Earn entries by scoring points in our Rewards Portal. Complete tasks, login with Discord, scan QR codes, and collect badges. Every 200 points = 1 extra entry. Attend Grand Final = guaranteed base entry. Visit the portal now to get started!",
    imageUrl: "/lucky-draw-banner.png"
  },
  items: [
    {
      id: "ann-1",
      title: "Lucky Draw Entry Mechanism",
      icon: "🎪",
      snippet: "🎫 Base Entry (+1): Attending Grand Final registration booth. 🎯 Extra Entry (+2): Login with Discord + Scan QR at GF + Earn 200+ points. 🎁 Maximum (+3): Complete ALL requirements. Combine portal participants with registration records before spinning!",
      linkText: "Understand the Mechanism",
      embedLink: "/rewards",
      isMap: false
    },
    {
      id: "ann-2",
      title: "Rewards Portal Guide",
      icon: "⭐",
      snippet: "Complete daily check-ins, submit tasks, and earn points. Track your progress towards 200 points for the lucky draw. Claim rewards and compete on the leaderboard. Every point brings you closer to spinning the wheel!",
      linkText: "Go to Rewards Portal",
      embedLink: "/rewards",
      isMap: false
    },
    {
      id: "ann-3",
      title: "Venue & Parking Details",
      icon: "📍",
      snippet: "Join us at the UCSI KL Campus. Directions, parking maps, and transit details are all available now. Please arrive early for registration.",
      linkText: "View Maps",
      embedLink: "https://share.google/bit2xjtgZt7XW9Pe2",
      isMap: true,
      secondaryLinkText: "Find Parking",
      secondaryEmbedLink: "https://drive.google.com/drive/folders/1TLJca2FYSmI4OtWoRxu07XbDkoH3S-cX?usp=sharing"
    }
  ]
};
