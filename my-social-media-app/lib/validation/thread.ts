"use client"

import * as z from "zod"

export const threadValidation = z.object({
    thread: z.string().min(3, {message: "The minimum character is 3"}),
    userId: z.string()
})

export const commentValidation = z.object({
    thread: z.string().min(3, {message: "The minimum character is 3"}),
})