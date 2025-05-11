import * as z from "zod";

export const settlementFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre del asentamiento debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del asentamiento solo debe contener letras" }),
    description: z
        .string()
        .max(200, { message: "La descripción no puede exceder los 200 caracteres" })
        .optional(),
});

export type SettlementFormValues = z.infer<typeof settlementFormSchema>;