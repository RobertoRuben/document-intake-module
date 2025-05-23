import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { DocumentCategoryFormValues } from "../../validators/document-category.validator.schema";
import { FileType } from "lucide-react";

interface DocumentCategoryModalFormFieldsProps {
    form: UseFormReturn<DocumentCategoryFormValues>;
}

export const DocumentCategoryFormFields: React.FC<DocumentCategoryModalFormFieldsProps> = ({ 
    form 
}) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <FileType className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información de la Categoría</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Introduce los datos de la categoría de documentos.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre de la Categoría</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el nombre de la categoría"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};