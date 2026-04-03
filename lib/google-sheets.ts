import { google } from "googleapis";

export async function appendRowToSheet(values: string[], range: string = "Sheet1!A:A") {
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
            range: range, // Use provided range or default
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [values],
            },
        });

        return { success: true };
    } catch (error: any) {
        console.error("Google Sheets API Error:", error);
        return { success: false, error: error.message || "API Error" };
    }
}

export async function getRowsFromSheet(range: string = "Sheet1!A:Z") {
    try {
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.warn("Google Sheets credentials missing. Skipping read.");
            return { success: false, data: [], error: "Missing credentials" };
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: serviceAccountEmail,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        const rows = response.data.values || [];
        return { success: true, data: rows };
    } catch (error: any) {
        console.error("Google Sheets API Read Error:", error);
        return { success: false, data: [], error: error.message || "API Error" };
    }
}
