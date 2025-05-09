import * as z from "zod";

export const employeeFormSchema = z.object({
    dni: z
        .number()
        .int({ message: "El DNI debe ser un número entero" })
        .positive({ message: "El DNI debe ser un número positivo" })
        .refine((val) => val.toString().length <= 8, { 
            message: "El DNI debe tener como máximo 8 dígitos" 
        }),
    paternalSurname: z
        .string()
        .min(2, { message: "El apellido paterno debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El apellido paterno solo debe contener letras" }),
    maternalSurname: z
        .string()
        .min(2, { message: "El apellido materno debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El apellido materno solo debe contener letras" }),
    names: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .regex(/^[a-zA-Z\s]+$/, { message: "El nombre solo debe contener letras" }),
    gender: z
        .string()
        .refine(val => ['Male', 'Female'].includes(val), {
            message: "El género debe ser un valor válido (Male, Female)"
        }),
    positionId: z
        .number()
        .int({ message: "El ID del cargo debe ser un número entero" })
        .positive({ message: "El ID del cargo debe ser un número positivo" }),
    departmentId: z
        .number()
        .int({ message: "El ID del departamento debe ser un número entero" })
        .positive({ message: "El ID del departamento debe ser un número positivo" }),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;