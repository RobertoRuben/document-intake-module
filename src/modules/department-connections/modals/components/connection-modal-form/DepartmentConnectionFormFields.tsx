import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/core/components/ui/form";
import { DepartmentConnectionFormValues } from "../../validators/department-connection.validator.schema";
import { DropdownSearchable } from "@/modules/core/components/ui/dropdown-searchable";
import { Building, ArrowRight } from "lucide-react";

interface DepartmentConnectionModalFormFieldsProps {
    form: UseFormReturn<DepartmentConnectionFormValues>;
    departments: { id: number; name: string }[];
}

export const DepartmentConnectionFormFields: React.FC<DepartmentConnectionModalFormFieldsProps> = ({ 
    form, 
    departments,
}) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Departamento Origen</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Selecciona el departamento de origen para esta conexión.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="sourceDepartmentId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Departamento Origen</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={departments}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione el departamento origen"
                                        filter="contains"
                                        value={departments.find(department => department.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="p-2 bg-muted rounded-full">
                    <ArrowRight className="h-6 w-6 text-primary" />
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Departamento Destino</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Selecciona el departamento de destino para esta conexión.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="targetDepartmentId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Departamento Destino</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={departments}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione el departamento destino"
                                        filter="contains"
                                        value={departments.find(department => department.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
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