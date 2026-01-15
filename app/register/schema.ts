import { z } from "zod"

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    university: z.string().min(2, { message: "University name is required." }),
    yearOfStudy: z.string().min(1, { message: "Year of study is required." }),
    course: z.string().min(2, { message: "Course/Major is required." }),
    interestType: z.enum(["individual", "team_finding", "team_ready"], {
        required_error: "Please select your participation preference.",
    }),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
