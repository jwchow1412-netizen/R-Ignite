import SubmissionForm from "@/components/SubmissionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Submit | R-Ignite Hackathon 2026",
  description: "Preliminary Round Submission for MASA Hackathon R-Ignite.",
};

export default function SubmitPage() {
  // Check the current deadline
  // May 7th, 2026 at 11:59 PM GMT+8
  const deadline = new Date("2026-05-07T23:59:00+08:00");
  const now = new Date();

  // If we are past the deadline
  if (now > deadline) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
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
      <div className="mb-4 text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white md:text-5xl">Hackathon Submission</h1>
        <p className="text-[rgba(248,244,246,0.7)]">
          Submit your team's preliminary round deliverable. Please ensure your report is in PDF format and does not exceed 100MB.
        </p>
      </div>

      <div className="w-full relative z-20">
        <SubmissionForm />
      </div>
    </div>
  );
}
