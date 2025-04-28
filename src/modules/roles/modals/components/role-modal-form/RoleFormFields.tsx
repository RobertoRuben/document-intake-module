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
import { RoleFormValues} from "@/modules/roles/modals/validators/role.validator.schema.ts";

interface RoleFormFieldsProps {
    form: UseFormReturn<RoleFormValues>;
}

export const RoleFormFields: React.FC<RoleFormFieldsProps> = ({ form }) => {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Rol</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ingrese el nombre del rol"
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