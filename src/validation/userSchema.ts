import {z} from "zod";

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "Enter name please"),

    email: z
        .string()
        .min(1, "Enter email please"),

    role: z
        .string()
        .min(1, "Select role "),
});


export const updateUserSchema = z.object({
    name: z
        .string()
        .min(1, "Enter name please"),

    email: z
        .string()
        .min(1, "Enter email please"),

    role: z
        .string()
        .min(1, "Select role "),
});
