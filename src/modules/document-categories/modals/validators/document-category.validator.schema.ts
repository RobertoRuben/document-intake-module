import * as z from "zod";

export const documentCategoryFormSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "El nombre de la categoría debe tener al menos 3 caracteres",
        })
        .max(100, {
            message: "El nombre de la categoría no puede exceder los 100 caracteres",
        })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
            message: "El nombre de la categoría solo debe contener letras",
        }),
});

export const createDocumentCategoryFormSchema = documentCategoryFormSchema;

export const updateDocumentCategoryFormSchema = documentCategoryFormSchema;

export type DocumentCategoryFormValues = z.infer<typeof documentCategoryFormSchema>;