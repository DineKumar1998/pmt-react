import { z } from "zod";

export const createRMValidator = z
    .object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().optional(),
        email: z.string().email("Invalid email"),
        country_code: z.enum(["+91", "+81"]),
        phone: z.string(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        user_type: z.enum(["RM", "Admin"]).optional()
    })
    .refine(
        (data) => {
            if (!data.phone) return true; // allow empty phone
            if (data.country_code === "+91") {
                return /^[6-9]\d{9}$/.test(data.phone); // Indian: 10 digits
            } else if (data.country_code === "+81") {
                return /^(70|80|90)\d{8}$/.test(data.phone); // Japanese: 10 digits
            }
            return false;
        },
        {
            message: "Invalid phone number format",
            path: ["phone"],
        }
    );

export const editRMValidator = z
    .object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().optional(),
        email: z.string().email("Invalid email"),
        country_code: z.enum(["+91", "+81"]),
        phone: z.string(),
        password: z
            .string()
            .optional()
            .refine((val) => !val || val.length >= 6, {
                message: "Password must be at least 6 characters long",
            }),
        profile_img: z.instanceof(File).optional(),
    })
    .partial()
    .refine(
        (data) => {
            if (!data.phone) return true; // allow empty phone
            if (data.country_code === "+91") {
                return /^[6-9]\d{9}$/.test(data.phone); // Indian: 10 digits
            } else if (data.country_code === "+81") {
                return /^(70|80|90)\d{8}$/.test(data.phone); // Japanese: 10 digits
            }
            return false;
        },
        {
            message: "Invalid phone number format",
            path: ["phone"],
        }
    );
