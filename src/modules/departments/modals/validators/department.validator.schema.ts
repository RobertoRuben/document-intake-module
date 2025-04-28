import * as z from "zod";

export const departmentFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "El nombre del departamento debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre del departamento solo debe contener letras" }),
    description: z
        .string()
        .max(200, { message: "La descripción no puede exceder los 200 caracteres" })
        .optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;