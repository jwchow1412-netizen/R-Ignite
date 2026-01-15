"use server"

import { registerSchema, type RegisterFormValues } from "./schema"

import { appendRowToSheet } from "@/lib/google-sheets"

export async function submitRegistration(data: RegisterFormValues) {
    const result = registerSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: "Invalid data" }
    }

    // Prepare data for Google Sheets
    // Columns: Timestamp, Full Name, Email, Phone, University, Year, Course, Interest Type
    const timestamp = new Date().toISOString()
    const row = [
        timestamp,
        result.data.fullName,
        result.data.email,
        result.data.phone,
        result.data.university,
        result.data.yearOfStudy,
        result.data.course,
        result.data.interestType,
    ]

    // Send to Google Sheets (fire and forget or await?)
    // Best to await to ensure it works, but catch error so we don't block user if sheets fails
    const sheetResult = await appendRowToSheet(row)
    if (!sheetResult.success) {
        console.error("Failed to save to Google Sheets:", sheetResult.error)
        // Optionally decide if we want to tell the user or just log it
        // For now, let's proceed but maybe log a warning
    }

    console.log("Registration submitted:", result.data)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Registration successful!" }
}
