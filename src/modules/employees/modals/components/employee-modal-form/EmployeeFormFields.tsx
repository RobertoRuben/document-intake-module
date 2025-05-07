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
import { EmployeeFormValues } from "../../validators/employee.validator.schema";
import { DropdownSearchable } from "@/modules/core/components/ui/dropdown-searchable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/core/components/ui/select";

interface EmployeeFormFieldsProps {
    form: UseFormReturn<EmployeeFormValues>;
    positions: { id: number; name: string }[];
    departments: { id: number; name: string }[];
}

export const EmployeeFormFields: React.FC<EmployeeFormFieldsProps> = ({ 
    form, 
    positions,
    departments 
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-3 border-b pb-2">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* DNI */}
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DNI</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ingrese el DNI"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Género</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un género" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Masculino</SelectItem>
                                        <SelectItem value="Female">Femenino</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-3 border-b pb-2">Nombres y Apellidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombres */}
                    <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombres</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese los nombres"
                                        {...field}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paternalSurname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido Paterno</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el apellido paterno"
                                        {...field}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="maternalSurname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido Materno</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ingrese el apellido materno"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-3 border-b pb-2">Información Laboral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="positionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cargo</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={positions}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione un cargo"
                                        filter="contains"
                                        value={positions.find(pos => pos.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={departments}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione un departamento"
                                        filter="contains"
                                        value={departments.find(dep => dep.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
                                        className="w-full"
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