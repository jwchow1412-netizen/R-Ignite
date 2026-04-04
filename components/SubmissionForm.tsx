"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { submitHackathonEntry } from "@/app/actions/submissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { getTeamSubmissionHistory, type SubmissionHistoryItem } from "@/app/actions/history";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (Adjusted for Free Tier limits)

const formSchema = z.object({
  teamName: z.string().min(1, "Team Name is required").max(30, "Max 30 characters"),
  leaderName: z.string().min(1, "Leader Name is required"),
  leaderEmail: z.string().email("Invalid email"),
  members: z.string().min(1, "Please list at least 2 other members to fulfill team size requirement"),
  universities: z.string().min(1, "Universities are required"),
  usedAI: z.string().min(1, "Please acknowledge if you used AI and how it was used."),
  agreed: z.boolean().refine(val => val === true, "You must agree to the Terms & Conditions and Rules & Regulations"),
});

type FormValues = z.infer<typeof formSchema>;

export type SubmissionLabels = {
  teamName?: string;
  leaderName?: string;
  leaderEmail?: string;
  members?: string;
  universities?: string;
  report?: string;
  appendix?: string;
  usedAI?: string;
  agreed?: string;
};

export default function SubmissionForm({ previewMode = false, labels = {} }: { previewMode?: boolean, labels?: SubmissionLabels }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [appendixFiles, setAppendixFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert("Report must be under 50MB");
        e.target.value = '';
        return;
      }
      setReportFile(file);
    }
  };

  const handleAppendixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 3) {
        alert("Maximum of 3 appendix files allowed");
        e.target.value = '';
        return;
      }
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          alert(`File ${file.name} is over 50MB limit`);
          e.target.value = '';
          return;
        }
      }
      setAppendixFiles(files);
    }
  };

  const uploadFileToSupabase = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // We assume the bucket name is 'submissions' and RLS is configured to accept authenticated/anon uploads
    const { error } = await supabase.storage
      .from('submissions')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(fileName);
    return publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    if (previewMode) {
      alert("Preview Mode: Actual submission is disabled.");
      return;
    }

    if (!reportFile) {
      setErrorMessage("Report file is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    try {
      setUploadProgress("Uploading Main Report...");
      const reportUrl = await uploadFileToSupabase(reportFile, data.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase());
      
      const appendicesUrls: string[] = [];
      if (appendixFiles.length > 0) {
        for (let i = 0; i < appendixFiles.length; i++) {
          setUploadProgress(`Uploading Appendix ${i + 1} of ${appendixFiles.length}...`);
          const url = await uploadFileToSupabase(appendixFiles[i], data.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase());
          appendicesUrls.push(url);
        }
      }

      setUploadProgress("Saving submission...");
      
      const result = await submitHackathonEntry({
        teamName: data.teamName,
        leaderName: data.leaderName,
        leaderEmail: data.leaderEmail,
        members: data.members,
        universities: data.universities,
        reportUrl,
        appendicesUrls: appendicesUrls.join(", "),
        usedAI: data.usedAI,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSubmitStatus("success");
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  if (submitStatus === "success") {
    return <SuccessView teamName={getValues("teamName")} />;
  }

  return (
    <Card className="max-w-2xl mx-auto my-8 bg-zinc-900 border-zinc-800 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-clash">Preliminary Round Submission</CardTitle>
        <CardDescription className="text-zinc-400">
          Ensure all information matches your Registration. Form must include 1 Report PDF (Max 50MB) and up to 3 Optional Appendix files.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">1. Team Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="teamName">{labels.teamName || "Team Name"} <span className="text-red-500">*</span></Label>
              <Input id="teamName" className="bg-zinc-950 border-zinc-800" placeholder="Max 30 characters" {...register("teamName")} />
              {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leaderName">{labels.leaderName || "Team Leader Full Name"} <span className="text-red-500">*</span></Label>
                <Input id="leaderName" className="bg-zinc-950 border-zinc-800" {...register("leaderName")} />
                {errors.leaderName && <p className="text-red-500 text-sm">{errors.leaderName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaderEmail">{labels.leaderEmail || "Leader Email"} <span className="text-red-500">*</span></Label>
                <Input id="leaderEmail" type="email" className="bg-zinc-950 border-zinc-800" {...register("leaderEmail")} />
                {errors.leaderEmail && <p className="text-red-500 text-sm">{errors.leaderEmail.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="members">{labels.members || "Other Members' Names & Emails (Separated by commas)"} <span className="text-red-500">*</span></Label>
              <textarea id="members" className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Member 2 Name (Email), Member 3 Name (Email)..." {...register("members")} />
              {errors.members && <p className="text-red-500 text-sm">{errors.members.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="universities">{labels.universities || "University Name(s)"} <span className="text-red-500">*</span></Label>
              <Input id="universities" className="bg-zinc-950 border-zinc-800" placeholder="E.g., University of Malaya, Monash University" {...register("universities")} />
              {errors.universities && <p className="text-red-500 text-sm">{errors.universities.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">2. Deliverables</h3>
            
            <div className="space-y-2 border border-zinc-800 p-4 rounded-lg bg-zinc-950/50">
              <Label htmlFor="report">{labels.report || "Main Hackathon Report (PDF)"} <span className="text-red-500">*</span></Label>
              <p className="text-xs text-zinc-400 mb-2">Max 10 pages for main body. Must be PDF format, max 50MB.</p>
              <Input id="report" type="file" accept=".pdf" className="bg-zinc-900 border-zinc-800" onChange={handleReportChange} required />
            </div>

            <div className="space-y-2 border border-zinc-800 p-4 rounded-lg bg-zinc-950/50">
              <Label htmlFor="appendix">{labels.appendix || "Appendices / Supporting Docs (Optional)"}</Label>
              <p className="text-xs text-zinc-400 mb-2">Max 3 files allowed, up to 50MB each. Code, datasets, visuals.</p>
              <Input id="appendix" type="file" multiple className="bg-zinc-900 border-zinc-800" onChange={handleAppendixChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">3. Declarations</h3>
            
            <div className="space-y-2">
              <Label htmlFor="usedAI">{labels.usedAI || "Artificial Intelligence Tools (Rule 7.1)"} <span className="text-red-500">*</span></Label>
              <p className="text-xs text-zinc-400 mb-2">Did your team use AI tools (e.g., ChatGPT, Copilot)? If yes, specify how. If no, write &quot;No&quot;.</p>
              <textarea id="usedAI" className="flex min-h-[60px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400" {...register("usedAI")} />
              {errors.usedAI && <p className="text-red-500 text-sm">{errors.usedAI.message}</p>}
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="agreed" className="mt-1" {...register("agreed")} />
              <div className="space-y-1 leading-none">
                <Label htmlFor="agreed" className="text-sm cursor-pointer">{labels.agreed || "I verify this submission is our original work and agree to the MASA T&C and Official Rules."}</Label>
                {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed.message}</p>}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#10B981] hover:bg-[#059669] text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress || "Submitting..."}
              </>
            ) : "Submit Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function SuccessView({ teamName }: { teamName: string }) {
  const [history, setHistory] = useState<SubmissionHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await getTeamSubmissionHistory(teamName);
        if (res.success && res.data) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [teamName]);

  return (
    <Card className="max-w-3xl mx-auto my-8 bg-zinc-900 border-zinc-800 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-[#10B981]">Submission Successful!</CardTitle>
        <CardDescription className="text-zinc-400">
          Your preliminary round submission has been received securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm">Please check your email shortly. If you submitted multiple times, only the latest valid submission before the deadline counts.</p>
        
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold border-b border-zinc-800 pb-2">Submission History for &quot;{teamName}&quot;</h3>
          
          {loading ? (
            <div className="flex items-center justify-center p-8 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading history...
            </div>
          ) : history && history.length > 0 ? (
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Timestamp</th>
                      <th className="px-4 py-3 font-medium">Report</th>
                      <th className="px-4 py-3 font-medium">Appendices</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-zinc-300">
                          {item.timestamp || "Just now"}
                        </td>
                        <td className="px-4 py-3">
                          {item.reportUrl ? (
                            <span className="text-[#10B981] inline-flex items-center gap-1 break-all" title={item.reportUrl.split("/").pop() || "report"}>
                              {item.reportUrl.split("/").pop()} <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            </span>
                          ) : <span className="text-zinc-600">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          {item.appendicesUrls ? (
                            <div className="flex flex-col gap-1">
                              {item.appendicesUrls.split(",").map((url, i) => {
                                const cleanUrl = url.trim();
                                if (!cleanUrl) return null;
                                const filename = cleanUrl.split("/").pop();
                                return (
                                  <span key={i} className="text-[#10B981] inline-flex items-start gap-1 text-xs break-all" title={filename}>
                                    {filename} <CheckCircle2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                  </span>
                                );
                              })}
                            </div>
                          ) : <span className="text-zinc-600">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-500">
              No previous history found or takes a moment to sync.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
