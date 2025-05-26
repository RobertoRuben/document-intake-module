import * as z from "zod";

export const documentaryTopicFormSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "El nombre del ambito documental debe tener al menos 3 caracteres",
        })
        .max(100, {
            message: "El nombre del ambito documental no puede exceder los 100 caracteres",
        })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, {
            message: "El nombre del ambito documental solo debe contener letras",
        }),
});

export const createDocumentaryTopicFormSchema = documentaryTopicFormSchema;

export const updateDocumentaryTopicFormSchema = documentaryTopicFormSchema;

export type DocumentaryTopicFormValues = z.infer<typeof documentaryTopicFormSchema>;