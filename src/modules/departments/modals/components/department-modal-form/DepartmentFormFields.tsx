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
import { DepartmentFormValues } from "@/modules/departments/modals/validators/department.validator.schema";

interface DepartmentFormFieldsProps {
    form: UseFormReturn<DepartmentFormValues>;
}

export const DepartmentFormFields: React.FC<DepartmentFormFieldsProps> = ({ form }) => {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Departamento</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ingrese el nombre del departamento"
                            {...field}
                            className="w-full"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};