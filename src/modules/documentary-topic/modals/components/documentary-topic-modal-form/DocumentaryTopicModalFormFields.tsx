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
import { DocumentaryTopicFormValues } from "../../validators/documentary-topic.validatos.schema";
import { FileType } from "lucide-react";

interface DocumentaryTopicModalFormFieldsProps {
    form: UseFormReturn<DocumentaryTopicFormValues>;
}

export const DocumentaryTopicFormFields: React.FC<DocumentaryTopicModalFormFieldsProps> = ({ 
    form 
}) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <FileType className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información del Tema Documental</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Introduce los datos del tema documental.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre del Tema Documental</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el nombre del tema documental"
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