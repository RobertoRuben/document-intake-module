import * as z from "zod";
import { UserStatus } from "@/modules/users/models/user.model";

export const userFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
        .regex(/^(?=.*[0-9]).*$/, { 
            message: "El nombre de usuario debe contener al menos un número" 
        }),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/^(?=.*[A-Z]).*$/, { 
            message: "La contraseña debe contener al menos una letra mayúscula" 
        })
        .regex(/^(?=.*[0-9]).*$/, { 
            message: "La contraseña debe contener al menos un número" 
        })
        .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/, { 
            message: "La contraseña debe contener al menos un carácter especial" 
        })
        .optional(),
    isActive: z
        .string()
        .refine(val => [UserStatus.ACTIVATE, UserStatus.DEACTIVATE].includes(val as UserStatus), {
            message: "El estado debe ser un valor válido"
        }),
    roleId: z
        .number()
        .int({ message: "El ID del rol debe ser un número entero" })
        .positive({ message: "El ID del rol debe ser un número positivo" }),
    employeeId: z
        .number()
        .int({ message: "El ID del empleado debe ser un número entero" })
        .positive({ message: "El ID del empleado debe ser un número positivo" }),
});

export const createUserFormSchema = userFormSchema.superRefine((data, ctx) => {
    if (!data.password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La contraseña es requerida",
            path: ["password"]
        });
    }
});

export const updateUserFormSchema = userFormSchema;

export type UserFormValues = z.infer<typeof userFormSchema>;