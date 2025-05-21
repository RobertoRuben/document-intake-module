import * as z from "zod";

export const hamletFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "El nombre del caserío debe tener al menos 3 caracteres",
    })
    .max(100, {
      message: "El nombre del caserío no puede exceder los 100 caracteres",
    })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
      message: "El nombre del caserío solo debe contener letras",
    }),
  settlementId: z
    .number()
    .int({ message: "El ID del asentamiento debe ser un número entero" })
    .positive({ message: "El ID del asentamiento debe ser un número positivo" })
    .optional(),
});

export const createHamletFormSchema = hamletFormSchema;

export const updateHamletFormSchema = hamletFormSchema;

export type HamletFormValues = z.infer<typeof hamletFormSchema>;
