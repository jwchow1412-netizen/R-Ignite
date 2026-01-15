# Google Sheets Setup Guide for R-Ignite

To store registration data in Google Sheets, you need to set up a Google Service Account. Follow these steps carefully.

## Step 1: Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top bar and select **New Project**.
3.  Name it `r-ignite-sheets` (or anything you like) and click **Create**.
4.  Select the newly created project.

## Step 2: Enable Google Sheets API
1.  In the search bar at the top, type `Google Sheets API`.
2.  Click on **Google Sheets API** from the Marketplace results.
3.  Click **Enable**.

## Step 3: Create a Service Account
1.  In the search bar, type `Service Accounts` (under IAM & Admin) and select it.
2.  Click **+ CREATE SERVICE ACCOUNT**.
3.  Name it `sheets-integrator` and click **Create and Continue**.
4.  (Optional) Grant this service account access to project: Select **Editor** (or leave mainly blank as we will share the specific sheet directly). Click **Continue**, then **Done**.
5.  You will see your new service account in the list. Copy the **Email** (e.g., `sheets-integrator@...iam.gserviceaccount.com`). You will need this later.

## Step 4: Create & Download Keys
1.  Click on the service account email you just created to open details.
2.  Go to the **Keys** tab.
3.  Click **ADD KEY** > **Create new key**.
4.  Select **JSON** and click **Create**.
5.  A JSON file will download to your computer. **Keep this safe!**

## Step 5: Set Up Your Google Sheet
1.  Create a new Google Sheet at [sheets.google.com](https://docs.google.com/spreadsheets).
2.  Name it "R-Ignite Registrations".
3.  Add headers in the first row (Row 1):
    *   **A1**: Timestamp
    *   **B1**: Full Name
    *   **C1**: Email
    *   **D1**: Phone
    *   **E1**: University
    *   **F1**: Year of Study
    *   **G1**: Course
    *   **H1**: Interest Type
    *   **IMPORTANT**: Ensure the **tab name** at the very bottom of the screen is `Sheet1`. If you renamed it to something else (e.g., "Registrations"), the API will fail unless you rename it back to `Sheet1`.
4.  **CRITICAL STEP**: Click the **Share** button (top right).
5.  Paste the **Service Account Email** (from Step 3.5) into the "Add people" box.
6.  Ensure it is set to **Editor**.
7.  Uncheck "Notify people" (optional) and click **Share**.

## Step 6: Configure Environment Variables
1.  Find your **Sheet ID**. It is the long string of random characters in the URL of your spreadsheet.
    *   Example URL: `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`**`/edit`
    *   The ID is `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`.
2.  Open the JSON key file you downloaded in Step 4. You will need the `private_key` value.
3.  In your Vercel project settings (or local `.env.local`), add these variables:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your-sheet-id-here"
```

GOOGLE_SHEET_ID="your-sheet-id-here"
```

**Important Notes for Vercel Dashboard**:
*   **Do NOT use quotes** (`""`) around the values when entering them in the Vercel UI "Value" field.
*   For `GOOGLE_PRIVATE_KEY`: Copy the text *between* the quotes in your JSON file. It should start with `-----BEGIN` and end with `KEY-----`.
*   If using a `.env.local` file for local development, you **DO** need the quotes.

## Step 7: Verify
Restart your development server or redeploy to Vercel. Submit a registration form and check if the row appears in your Google Sheet!
