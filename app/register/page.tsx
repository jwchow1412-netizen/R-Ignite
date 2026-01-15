"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { registerSchema, type RegisterFormValues } from "./schema"
import { submitRegistration } from "./actions"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      university: "",
      yearOfStudy: "",
      course: "",
      interestType: undefined,
    },
    mode: "onChange",
  })

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = form

  const steps = [
    {
      id: "personal",
      title: "Personal Details",
      fields: ["fullName", "email", "phone"] as const,
    },
    {
      id: "academic",
      title: "Academic Info",
      fields: ["university", "course", "yearOfStudy"] as const,
    },
    {
      id: "preference",
      title: "Participation",
      fields: ["interestType"] as const,
    },
  ]

  const nextStep = async () => {
    // @ts-expect-error - dynamic fields key check
    const fields = steps[step].fields
    const output = await trigger(fields)

    if (output) {
      setStep((s) => Math.min(s + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await submitRegistration(data)
      if (result.success) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md border-accent/20 bg-accent/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl">🎉</CardTitle>
            <CardTitle className="text-center text-xl">You&apos;re All Set!</CardTitle>
            <CardDescription className="text-center text-base">
              Thanks for registering your interest in MASA Hackathon 2026: R-Ignite. We&apos;ll be in
              touch shortly with more details.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="default">
              <a href="/">Back to Home</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center py-12 px-4 relative z-10">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold text-white md:text-5xl">Register Interest</h1>
        <p className="text-[rgba(248,244,246,0.7)]">
          Join the actuarial innovation revolution.
        </p>
      </div>

      <Card className="w-full max-w-lg border-[rgba(212,100,118,0.2)] bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                    step >= i
                      ? "bg-accent text-white shadow-[0_0_15px_rgba(212,100,118,0.5)]"
                      : "bg-[rgba(255,255,255,0.05)] text-[rgba(248,244,246,0.4)]"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider transition-colors duration-300",
                    step >= i ? "text-white" : "text-[rgba(248,244,246,0.3)]"
                  )}
                >
                  {s.id}
                </span>
              </div>
            ))}
            {/* Progress Bar Line */}
            <div className="absolute top-[4.5rem] left-0 h-[2px] w-full bg-[rgba(255,255,255,0.05)] -z-0 px-10">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
          <CardTitle>{steps[step].title}</CardTitle>
          <CardDescription>
            Please fill in your details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...register("fullName")}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+60123456789"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        placeholder="University of Malaya"
                        {...register("university")}
                        className={errors.university ? "border-red-500" : ""}
                      />
                      {errors.university && (
                        <p className="text-xs text-red-500">{errors.university.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course / Major</Label>
                      <Input
                        id="course"
                        placeholder="Actuarial Science"
                        {...register("course")}
                        className={errors.course ? "border-red-500" : ""}
                      />
                      {errors.course && (
                        <p className="text-xs text-red-500">{errors.course.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Input
                        id="yearOfStudy"
                        placeholder="Year 2"
                        {...register("yearOfStudy")}
                        className={errors.yearOfStudy ? "border-red-500" : ""}
                      />
                      {errors.yearOfStudy && (
                        <p className="text-xs text-red-500">{errors.yearOfStudy.message}</p>
                      )}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      <Label>Participation Preference</Label>
                      <div className="grid gap-3">
                        {["individual", "team_finding", "team_ready"].map((type) => (
                          <label
                            key={type}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all hover:bg-white/5",
                              watch("interestType") === type
                                ? "border-accent bg-accent/5"
                                : "border-white/10 bg-transparent"
                            )}
                          >
                            <span className="text-sm font-medium text-white capitalize">
                              {type.replace("_", " ")}
                            </span>
                            <input
                              type="radio"
                              value={type}
                              {...register("interestType")}
                              className="accent-accent h-4 w-4"
                            />
                          </label>
                        ))}
                      </div>
                      {errors.interestType && (
                        <p className="text-xs text-red-500">{errors.interestType.message}</p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 0 || isSubmitting}
            className={step === 0 ? "invisible" : ""}
          >
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button onClick={nextStep} type="button">
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
