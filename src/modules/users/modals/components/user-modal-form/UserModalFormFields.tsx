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
import { UserFormValues } from "../../validators/user.validator.schema";
import { DropdownSearchable } from "@/modules/core/components/ui/dropdown-searchable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/core/components/ui/select";
import { UserStatus } from "@/modules/users/models/user.model";
import { Shield, UserCheck } from "lucide-react";

interface UserModalFormFieldsProps {
    form: UseFormReturn<UserFormValues>;
    roles: { id: number; name: string }[];
    employees: { id: number; name: string }[];
    isEditing: boolean;
}

export const UserModalFormFields: React.FC<UserModalFormFieldsProps> = ({ 
    form, 
    roles,
    employees,
    isEditing
}) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información de Acceso</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Introduce las credenciales y datos de acceso al sistema.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre de Usuario</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el nombre de usuario"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!isEditing && (
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Ingrese la contraseña"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Estado</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={UserStatus.ACTIVATE}>Activo</SelectItem>
                                        <SelectItem value={UserStatus.DEACTIVATE}>Inactivo</SelectItem>
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
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Asignaciones</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Asigna el trabajador y rol correspondiente a este usuario.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Trabajador Asociado</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={employees}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione un trabajador"
                                        filter="contains"
                                        value={employees.find(emp => emp.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Rol</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={roles}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione un rol"
                                        filter="contains"
                                        value={roles.find(role => role.id === field.value)}
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