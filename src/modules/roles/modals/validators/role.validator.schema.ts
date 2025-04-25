import * as z from "zod";

export const roleFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre del rol debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del rol solo debe contener letras" }),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;