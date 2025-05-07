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
import { PositionFormValues } from "../../validators/position.validator.schema";

interface PositionFormFieldsProps {
    form: UseFormReturn<PositionFormValues>;
}

export const PositionFormFields: React.FC<PositionFormFieldsProps> = ({ form }) => {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Cargo</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ingrese el nombre del cargo"
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