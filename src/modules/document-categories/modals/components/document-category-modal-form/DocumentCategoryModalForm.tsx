import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { DocumentCategory } from "@/modules/document-categories/model/document-category.model";
import { DocumentCategoryModalFooter } from "../document-category-modal-footer/DocumentCategoryModalFooter";
import { DocumentCategoryFormFields } from "./DocumentCategoryModalFormFields";
import { useDocumentCategoryForm } from "../../hooks/use-document-category.hook";
import { DocumentCategoryFormValues } from "@/modules/document-categories/modals/validators/document-category.validator.schema";

interface DocumentCategoryModalFormProps {
    documentCategory?: DocumentCategory;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: DocumentCategory) => Promise<boolean>;
}

export const DocumentCategoryModalForm: React.FC<DocumentCategoryModalFormProps> = ({
    documentCategory,
    isEditing,
    onClose,
    onSubmit,
}) => {
    const { form } = useDocumentCategoryForm(documentCategory);

    const handleSubmit = async (values: DocumentCategoryFormValues) => {
        const categoryData: DocumentCategory = {
            id: documentCategory?.id || undefined,
            name: values.name,
        };

        const success = await onSubmit(categoryData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <DocumentCategoryFormFields form={form} />
                </div>
                <DocumentCategoryModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};