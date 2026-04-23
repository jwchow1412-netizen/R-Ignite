// We removed the static forumHighlights mock array. The Forum now pulls 'Intel' dynamically from the 'forum_posts' Supabase table.

export const forumAnnouncements = {
  hero: {
    id: "hero-1",
    title: "The Workshop is Nearing! 🚀",
    subtitle: "Get ready for a day of intensive learning, networking, and expert insights. Date: 25th April 2026. Make sure you have your laptops prepopulated with our RScript starter packs.",
    imageUrl: "/Forum/poster-new.png"
  },
  items: [
    {
      id: "ann-1",
      title: "Venue & Parking Details",
      icon: "📍",
      snippet: "Join us at the UCSI KL Campus. Directions, parking maps, and transit details are all available now. Please arrive early for registration.",
      linkText: "View Maps",
      embedLink: "https://share.google/bit2xjtgZt7XW9Pe2",
      isMap: true,
      secondaryLinkText: "Find Parking",
      secondaryEmbedLink: "https://drive.google.com/drive/folders/1TLJca2FYSmI4OtWoRxu07XbDkoH3S-cX?usp=sharing"
    },
    {
      id: "ann-2",
      title: "Schedule Reminder",
      icon: "📅",
      snippet: "Registration starts promptly at 12:00 PM. The Fireside conversation follows the opening ceremony. Check out the full breakdown.",
      linkText: "View Schedule",
      embedLink: "/timeline",
      isMap: false
    },
    {
      id: "ann-3",
      title: "Preparation Guide",
      icon: "💻",
      snippet: "Download the necessary software and dependencies for the Modelling Case Study (14:10). Don't forget your chargers!",
      linkText: "Download Material",
      embedLink: "https://discord.gg/49nQjN38zS",
      isMap: false
    }
  ]
};
