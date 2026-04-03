"use server";
import { appendRowToSheet } from "@/lib/google-sheets";

export async function submitHackathonEntry(data: {
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    members: string;
    universities: string;
    reportUrl: string;
    appendicesUrls: string;
    usedAI: string;
}) {
    try {
        const timestamp = new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" });
        
        // Append to Google Sheets Submissions tab
        const values = [
            timestamp,
            data.teamName,
            data.leaderName,
            data.leaderEmail,
            data.members,
            data.universities,
            data.reportUrl,
            data.appendicesUrls,
            data.usedAI
        ];

        const response = await appendRowToSheet(values, "Submissions!A:A");

        if (!response.success) {
            return { success: false, error: `Google Sheets Error: ${response.error}` };
        }

        return { success: true };
    } catch (error) {
        console.error("Submission Error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
