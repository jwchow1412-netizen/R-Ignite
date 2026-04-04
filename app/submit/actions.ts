"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminRewardsUser } from "@/lib/rewards-server";

export async function updateSubmissionSettings(formData: FormData) {
  const { supabase } = await requireAdminRewardsUser("/submit/admin");

  const isOpenStr = formData.get("isOpen");
  const isOpen = isOpenStr === "on" || isOpenStr === "true";
  
  const openingTime = String(formData.get("openingTime") || "");
  const closingTime = String(formData.get("closingTime") || "");

  const payload = {
    is_open: isOpen,
    opening_time: openingTime || null,
    closing_time: closingTime || null,
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      key: "submission_window",
      value: payload,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    redirect(`/submit/admin?error=${encodeURIComponent("Could not update submission settings.")}`);
  }

  revalidatePath("/submit");
  revalidatePath("/submit/admin");
  
  redirect(`/submit/admin?success=${encodeURIComponent("Submission settings updated.")}`);
}

export async function updateSubmissionLabels(formData: FormData) {
  const { supabase } = await requireAdminRewardsUser("/submit/admin");

  const payload = {
    teamName: String(formData.get("teamName") || ""),
    leaderName: String(formData.get("leaderName") || ""),
    leaderEmail: String(formData.get("leaderEmail") || ""),
    members: String(formData.get("members") || ""),
    universities: String(formData.get("universities") || ""),
    report: String(formData.get("report") || ""),
    appendix: String(formData.get("appendix") || ""),
    usedAI: String(formData.get("usedAI") || ""),
    agreed: String(formData.get("agreed") || ""),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      key: "submission_labels",
      value: payload,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    redirect(`/submit/admin?error=${encodeURIComponent("Could not update submission labels.")}`);
  }

  revalidatePath("/submit");
  revalidatePath("/submit/admin");
  
  redirect(`/submit/admin?success=${encodeURIComponent("Submission labels updated.")}`);
}
