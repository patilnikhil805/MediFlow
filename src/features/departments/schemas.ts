import {z} from 'zod'

export const createDepartmentSchema = z.object({
    name:z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ])
    .optional(),
})

export const updateDepartmentSchema = z.object({
    name:z.string().trim().min(1, "Must be 1 or more characters").optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ])
    .optional(),
})