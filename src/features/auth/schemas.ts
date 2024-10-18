import { z } from "zod"



export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Minimum 8 characters required"),
})


export const RegisterSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().email(),
    password: z.string().min(8, "Minimum 8 characters required"),
})