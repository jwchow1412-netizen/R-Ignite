"use server";
import { getRowsFromSheet } from "@/lib/google-sheets";

export type SubmissionHistoryItem = {
    timestamp: string;
    teamName: string;
    reportUrl: string;
    appendicesUrls: string;
};

export async function getTeamSubmissionHistory(teamName: string): Promise<{ success: boolean; data?: SubmissionHistoryItem[]; error?: string }> {
    try {
        const response = await getRowsFromSheet("Submissions!A:Z");

        if (!response.success || !response.data) {
            return { success: false, error: response.error || "Failed to fetch from Google Sheets." };
        }

        const rows = response.data;
        if (rows.length < 2) { // 0 or just headers
            return { success: true, data: [] };
        }

        const headers = rows[0].map(h => String(h).trim().toLowerCase());
        
        // Dynamic index detection with fallbacks to our default scheme
        const teamNameIndex = headers.indexOf("team name") > -1 ? headers.indexOf("team name") : 1;
        const timestampIndex = headers.indexOf("timestamp") > -1 ? headers.indexOf("timestamp") : 0;
        
        let reportUrlIndex = 6;
        if (headers.indexOf("report url") > -1) reportUrlIndex = headers.indexOf("report url");
        
        let appendicesUrlsIndex = 7;
        if (headers.indexOf("appendix urls") > -1) appendicesUrlsIndex = headers.indexOf("appendix urls");
        if (headers.indexOf("appendices urls") > -1) appendicesUrlsIndex = headers.indexOf("appendices urls");

        const targetTeamName = teamName.toLowerCase().trim();
        const history: SubmissionHistoryItem[] = [];

        // Loop through rows ignoring headers
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowTeamName = String(row[teamNameIndex] || "").toLowerCase().trim();

            if (rowTeamName === targetTeamName) {
                history.push({
                    timestamp: String(row[timestampIndex] || ""),
                    teamName: String(row[teamNameIndex] || ""),
                    reportUrl: String(row[reportUrlIndex] || ""),
                    appendicesUrls: String(row[appendicesUrlsIndex] || "")
                });
            }
        }

        // Reverse to show latest submissions at the top
        history.reverse();

        return { success: true, data: history };
    } catch (error: any) {
        console.error("History Fetch Error:", error);
        return { success: false, error: "An unexpected error occurred while fetching history." };
    }
}
