import { z } from "zod"

export const createProductSchema = z.object({
    name: z.string().min(2, "Name is required"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),

    inStock: z.boolean(),
})


export const updateProductSchema = z.object({
    name: z.string().min(2, "Name is required"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    inStock: z.boolean(),
})

