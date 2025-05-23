import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentCategory } from "@/modules/document-categories/model/document-category.model";
import { 
    DocumentCategoryFormValues, 
    createDocumentCategoryFormSchema,
    updateDocumentCategoryFormSchema
} from "../validators/document-category.validator.schema";

export const useDocumentCategoryForm = (documentCategory?: DocumentCategory) => {
    const formSchema = documentCategory ? updateDocumentCategoryFormSchema : createDocumentCategoryFormSchema;
    
    const form = useForm<DocumentCategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    useEffect(() => {
        if (documentCategory) {
            form.reset({
                name: documentCategory.name
            });
        }
    }, [documentCategory, form]);

    return {
        form,
    };
};