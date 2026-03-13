export const faqData = [
  {
    category: "General Information",
    items: [
      {
        question: "What is MASA Hackathon 2026: R-Ignite?",
        answer: "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. It is a two-month event offering Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems, gain hands-on experience, enhance analytical skills, and network with industry professionals."
      },
      {
        question: "Who is organising the hackathon?",
        answer: "The Malaysian Actuarial Student Association (MASA) is organising the event, with submissions being graded by judges from our Strategic Partner, Hannover Re."
      },
      {
        question: "How do I get more information?",
        answer: "Resources will be updated under the Downloads section. For any questions or clarifications, you can direct them to the Organizer via email: hackathon@masassociation.org."
      }
    ]
  },
  {
    category: "Eligibility & Registration",
    items: [
      {
        question: "Who is eligible to participate?",
        answer: "The MASA Hackathon is open to all undergraduate students only."
      },
      {
        question: "What are the requirements for team formation?",
        answer: "Teams must consist of three to five (3-5) members. One leader must be assigned per Team. Each individual may join only one team, and registration is non-transferable."
      },
      {
        question: "When is the deadline for the Registration Form?",
        answer: "Teams are required to fill in an online registration form no later than 11:59 p.m. on 23rd April 2026. The form will be made available at 12:00 p.m. on 3rd April 2026. Appeals for an extension of the registration period will not be entertained."
      },
      {
        question: "Are there any restrictions on the team name?",
        answer: "Registered team names must be appropriate and professional, not exceeding a limit of 30 characters. The selected team name must remain consistent throughout the MASA Hackathon competition phase. Explicit content and offensive language are strictly prohibited."
      }
    ]
  },
  {
    category: "Submission & Format",
    items: [
      {
        question: "When is the deadline for the Preliminary Round submissions?",
        answer: "Final submissions must be attached to a completed entry submission form no later than 11:59 p.m. on 7th May 2026 (Thursday). Late submissions are ineligible for participation."
      },
      {
        question: "What materials must be submitted?",
        answer: "Participants are required to submit both a written report and the complete source code used in the project. The submitted report must be a single document in PDF format (maximum of 100 megabytes)."
      },
      {
        question: "What are the formatting guidelines for the report?",
        answer: "The body of the report's length cannot exceed 10 pages (excluding cover page, table of contents, bibliography, and appendices). Reports must have 1-inch (2.5-cm) margins, typed in Times New Roman standard font size of 12pt (larger sizes permitted for headers), and 1.5 line spacing. English must be used."
      },
      {
        question: "Can we use Artificial Intelligence (AI)?",
        answer: "Any generative Artificial Intelligence (AI) tools used in developing a submission shall be acknowledged and documented responsibly and appropriately. The Team is accountable for the originality and integrity of the content and ensuring any AI-generated output is validated."
      },
      {
        question: "How many submissions can we make?",
        answer: "Each Team is allowed to submit only one Entry. If a Team submits more than one, only the latest submission received prior to the Entry Due Date will be judged."
      }
    ]
  },
  {
    category: "Judging & Prizes",
    items: [
      {
        question: "What are the evaluation criteria?",
        answer: "Projects will be evaluated on Problem Framing and Preliminary Data Exploration (20%), Modelling and In-Depth Data Analysis (20%), Financial Impact Assessment (20%), Strategic Risk Management Recommendations (20%), and Overall Storyline and Presentation (20%). Bonus points (10%) are available for outstanding technical skills and exceptional articulation."
      },
      {
        question: "What are the Prizes for MASA Hackathon 2026?",
        answer: "Three Teams will be selected as winners. First-place receives RM 3,000, Second-place receives RM 2,000, and Third-place receives RM 1,000."
      },
      {
        question: "When and where is the Grand Final Pitch?",
        answer: "The Finalist Teams will be notified by 24th May 2026. They will then be invited to present their submissions physically at GG08, UCSI University (Kuala Lumpur campus) on 6th June 2026 (Saturday)."
      }
    ]
  },
  {
    category: "Policies & Terms",
    items: [
      {
        question: "Who owns the Intellectual Property of the submissions?",
        answer: "All submissions must be the original work of the participants. Participants retain ownership of their projects. However, participants grant MASA and its partners a non-exclusive license to use, reproduce, modify, and display the submissions for promotional and educational purposes."
      },
      {
        question: "What happens if technical failures prevent submission?",
        answer: "Neither the Organizer nor the Strategic Partner are responsible for incorrect transcription, technical malfunctions, or delayed transmission. However, if submission via the form fails once, Teams may email their submission directly (maximum 50MB) to hackathon@masassociation.org, copying all team members."
      },
      {
        question: "How will our data be protected?",
        answer: "Personal information will only be used for winner selection, addressing questions regarding content, communicating news, or as permitted in the Official Rules. MASA will not share personal data with third parties without consent, except as required by law."
      }
    ]
  }
];

// Helper to extract a flat array of categories useful for UI mapping
export const getFaqCategories = () => faqData.map(c => c.category);
