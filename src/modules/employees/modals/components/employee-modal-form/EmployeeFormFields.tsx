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
import { User, Briefcase } from "lucide-react";

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
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información Personal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Introduce la información personal e identificación del empleado.
                </p>
                <div className="space-y-4">
                    {/* DNI */}
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>DNI</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el DNI"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nombres */}
                    <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombres</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese los nombres"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Apellido Paterno */}
                    <FormField
                        control={form.control}
                        name="paternalSurname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Apellido Paterno</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el apellido paterno"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Apellido Materno */}
                    <FormField
                        control={form.control}
                        name="maternalSurname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Apellido Materno</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el apellido materno"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Género */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="w-full">
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

            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información Laboral</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Selecciona la información relacionada con el puesto de trabajo.
                </p>
                <div className="space-y-4">
                    {/* Cargo */}
                    <FormField
                        control={form.control}
                        name="positionId"
                        render={({ field }) => (
                            <FormItem className="w-full">
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Departamento */}
                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem className="w-full">
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