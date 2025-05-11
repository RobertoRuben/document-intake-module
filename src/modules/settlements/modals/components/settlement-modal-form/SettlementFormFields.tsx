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
import { SettlementFormValues } from "../../validators/settlement.validator.schema";

interface SettlementFormFieldsProps {
    form: UseFormReturn<SettlementFormValues>;
}

export const SettlementFormFields: React.FC<SettlementFormFieldsProps> = ({ form }) => {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Asentamiento</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ingrese el nombre del asentamiento"
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