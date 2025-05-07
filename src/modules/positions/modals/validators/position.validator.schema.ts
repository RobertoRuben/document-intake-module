import * as z from "zod";

export const positionFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre del cargo debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del cargo solo debe contener letras" }),
    description: z
        .string()
        .max(200, { message: "La descripción no puede exceder los 200 caracteres" })
        .optional(),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;