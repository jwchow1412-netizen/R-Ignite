"use server"

import { registerSchema, type RegisterFormValues } from "./schema"

export async function submitRegistration(data: RegisterFormValues) {
    const result = registerSchema.safeParse(data)

    if (!result.success) {
        return { success: false, error: "Invalid data" }
    }

    // TODO: Integrate with database or Google Sheets API here
    console.log("Registration submitted:", result.data)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Registration successful!" }
}
