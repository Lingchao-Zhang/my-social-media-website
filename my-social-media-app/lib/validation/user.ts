"use client"

import * as z from "zod"

export const formValidation = z.object({
  profile_image: z.string().url(),
  username: z.string().min(3).max(50),
  name: z.string().min(2).max(100),
  biography: z.string().min(1).max(1000)
})
