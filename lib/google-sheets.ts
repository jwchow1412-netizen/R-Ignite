import { google } from "googleapis";

export async function appendRowToSheet(values: string[]) {
    try {
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"); // Handle newline characters
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.warn("Google Sheets credentials missing. Skipping submission.");
            return { success: false, error: "Missing credentials" };
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: serviceAccountEmail,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "Sheet1!A:A", // Assumes defaults
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [values],
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Google Sheets API Error:", error);
        return { success: false, error: "API Error" };
    }
}
