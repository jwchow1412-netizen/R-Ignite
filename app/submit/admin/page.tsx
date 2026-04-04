import { requireAdminRewardsUser } from "@/lib/rewards-server";
import { updateSubmissionSettings, updateSubmissionLabels } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmissionForm, { SubmissionLabels } from "@/components/SubmissionForm";

export const metadata = {
  title: "Submission Settings Admin | MASA Hackathon 2026",
};

export default async function SubmitAdminPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const { supabase } = await requireAdminRewardsUser("/submit/admin");

  const [windowResult, labelsResult] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "submission_window").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "submission_labels").maybeSingle()
  ]);

  // Define defaults
  const settings = (windowResult.data?.value as {
    is_open?: boolean;
    opening_time?: string | null;
    closing_time?: string | null;
  }) || {
    is_open: true,
    opening_time: "2026-04-25T12:00:00+08:00",
    closing_time: "2026-05-07T23:59:00+08:00",
  };

  const labels = (labelsResult.data?.value as SubmissionLabels) || {};

  // Convert ISO string to format suitable for datetime-local
  const formatForInput = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    } catch {
      return "";
    }
  };

  const currentOpen = settings.is_open ?? true;
  const currentOpenTime = formatForInput(settings.opening_time);
  const currentCloseTime = formatForInput(settings.closing_time);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top_left,rgba(212,100,118,0.24),transparent_36%),radial-gradient(circle_at_top_right,rgba(244,165,96,0.16),transparent_28%)]" />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Left Column: Settings */}
          <div className="space-y-6">
            <section className="glass-panel p-8 h-full">
              <h1 className="text-3xl font-bold text-white">Submission Settings</h1>
              <p className="mt-2 text-[rgba(248,244,246,0.8)]">
                Manage preliminary round availability and customize field text.
              </p>

              {searchParams?.success && (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  {searchParams.success}
                </div>
              )}

              {searchParams?.error && (
                <div className="mt-6 rounded-2xl border border-[rgba(212,100,118,0.28)] bg-[rgba(212,100,118,0.1)] px-4 py-3 text-sm text-[#ffd6dd]">
                  {searchParams.error}
                </div>
              )}

              <form action={updateSubmissionSettings} className="mt-8 space-y-6 border-b border-white/10 pb-8">
                <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isOpen" className="text-lg font-semibold text-white">Accepting Submissions</Label>
                      <p className="text-sm text-[rgba(248,244,246,0.68)] mt-1">
                        Toggle this off to immediately close the form for all users.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isOpen"
                        name="isOpen"
                        defaultChecked={currentOpen}
                        className="h-5 w-5 rounded border-white/20 bg-black/40 text-accent focus:ring-accent accent-[rgb(212,100,118)]"
                        value="true"
                      />
                      <Label htmlFor="isOpen" className="text-white">Active</Label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="openingTime" className="text-white">Opening Time</Label>
                    <Input
                      type="datetime-local"
                      id="openingTime"
                      name="openingTime"
                      defaultValue={currentOpenTime}
                      className="bg-black/40 border-white/10 text-white w-full text-base [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="closingTime" className="text-white">Closing Time (Deadline)</Label>
                    <Input
                      type="datetime-local"
                      id="closingTime"
                      name="closingTime"
                      defaultValue={currentCloseTime}
                      className="bg-black/40 border-white/10 text-white w-full text-base [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    Save Window & Availability
                  </Button>
                </div>
              </form>

              {/* Edit Question Text Form */}
              <form action={updateSubmissionLabels} className="mt-8 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Edit Question Text</h2>
                
                <div className="space-y-3">
                  <Label className="text-white">Team Name Field</Label>
                  <Input name="teamName" defaultValue={labels.teamName || "Team Name"} className="bg-black/40 border-white/10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Leader Name Field</Label>
                  <Input name="leaderName" defaultValue={labels.leaderName || "Team Leader Full Name"} className="bg-black/40 border-white/10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Leader Email Field</Label>
                  <Input name="leaderEmail" defaultValue={labels.leaderEmail || "Leader Email"} className="bg-black/40 border-white/10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Other Members Field</Label>
                  <Input name="members" defaultValue={labels.members || "Other Members' Names & Emails (Separated by commas)"} className="bg-black/40 border-white/10 text-white" />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Universities Field</Label>
                  <Input name="universities" defaultValue={labels.universities || "University Name(s)"} className="bg-black/40 border-white/10 text-white" />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Report Upload Field</Label>
                  <Input name="report" defaultValue={labels.report || "Main Hackathon Report (PDF)"} className="bg-black/40 border-white/10 text-white" />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Appendix Upload Field</Label>
                  <Input name="appendix" defaultValue={labels.appendix || "Appendices / Supporting Docs (Optional)"} className="bg-black/40 border-white/10 text-white" />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Used AI Field</Label>
                  <Input name="usedAI" defaultValue={labels.usedAI || "Artificial Intelligence Tools (Rule 7.1)"} className="bg-black/40 border-white/10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">Agreed Field</Label>
                  <Input name="agreed" defaultValue={labels.agreed || "I verify this submission is our original work and agree to the MASA T&C and Official Rules."} className="bg-black/40 border-white/10 text-white" />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="secondary" className="w-full">
                    Save Labels
                  </Button>
                </div>
              </form>

            </section>
          </div>

          {/* Right Column: Preview Form */}
          <div className="space-y-6">
            <div className="glass-panel p-8 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Live Form Preview</h2>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  Preview Mode
                </span>
              </div>
              <p className="text-sm text-[rgba(248,244,246,0.68)] mb-6">
                This shows exactly what participants will see with your custom labels. Real submissions are disabled here.
              </p>
              
              {/* Form Component directly rendered with preview limits */}
              <div className="scale-[0.9] origin-top -mt-4 -ml-4 -mr-4">
                <SubmissionForm previewMode={true} labels={labels} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
