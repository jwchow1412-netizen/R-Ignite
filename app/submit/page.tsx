import SubmissionForm from "@/components/SubmissionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Submit | R-Ignite Hackathon 2026",
  description: "Preliminary Round Submission for MASA Hackathon R-Ignite.",
};

export default async function SubmitPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

  const [windowResult, labelsResult] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "submission_window").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "submission_labels").maybeSingle()
  ]);

  const settings = (windowResult.data?.value as {
    is_open?: boolean;
    opening_time?: string | null;
    closing_time?: string | null;
  }) || {
    is_open: true,
    opening_time: "2026-04-25T12:00:00+08:00",
    closing_time: "2026-05-07T23:59:00+08:00",
  };

  const labels = labelsResult.data?.value || {};

  if (settings.is_open === false) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
        {isAdmin && (
          <div className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10">
            <Link href="/submit/admin" className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              <span className="text-sm font-semibold">Edit Form</span>
            </Link>
          </div>
        )}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Submissions Closed</h1>
        </div>

        <Card className="w-full max-w-lg border-[rgba(212,100,118,0.2)] bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-500">Not Accepting Responses</CardTitle>
            <CardDescription className="text-zinc-300 mt-2">
              The submission form has been manually closed by the administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center mt-4">
            <a href="/" className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors">Return Home</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deadline = settings.closing_time ? new Date(settings.closing_time) : new Date("2026-05-07T23:59:00+08:00");
  const openingTime = settings.opening_time ? new Date(settings.opening_time) : new Date("2026-04-25T12:00:00+08:00");
  const now = new Date();

  // If we haven't reached the opening time yet
  if (now < openingTime) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
        {isAdmin && (
          <div className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10">
            <Link href="/submit/admin" className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              <span className="text-sm font-semibold">Edit Form</span>
            </Link>
          </div>
        )}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Submissions Closed</h1>
        </div>

        <Card className="w-full max-w-lg border-[rgba(212,100,118,0.2)] bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-yellow-500">Opens Soon</CardTitle>
            <CardDescription className="text-zinc-300 mt-2">
              The preliminary round submission window opens on 25th April 2026 at 12:00 p.m. Malaysia Time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center mt-4">
            <a href="/" className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors">Return Home</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we are past the deadline
  if (now > deadline) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
        {isAdmin && (
          <div className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10">
            <Link href="/submit/admin" className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              <span className="text-sm font-semibold">Edit Form</span>
            </Link>
          </div>
        )}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Submissions Closed</h1>
        </div>

        <Card className="w-full max-w-lg border-[rgba(212,100,118,0.2)] bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-500">Deadline Passed</CardTitle>
            <CardDescription className="text-zinc-300 mt-2">
              The preliminary round submission window closed on 7th May 2026 at 11:59 p.m. <br/>
              Late submissions are not accepted as per Rule 4.2.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center mt-4">
            <a href="/" className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors">Return Home</a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10">
          <Link href="/submit/admin" className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            <span className="text-sm font-semibold">Edit Form</span>
          </Link>
        </div>
      )}
      <div className="mb-4 text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white md:text-5xl">Hackathon Submission</h1>
        <p className="text-[rgba(248,244,246,0.7)]">
          Submit your team&apos;s preliminary round deliverable. Please ensure your report is in PDF format and does not exceed 100MB.
        </p>
      </div>

      <div className="w-full relative z-20">
        <SubmissionForm labels={labels} />
      </div>
    </div>
  );
}
