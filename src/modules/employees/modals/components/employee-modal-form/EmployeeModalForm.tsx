import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Employee } from "@/modules/employees/models/employee.model";
import { EmployeeModalFooter } from "../employee-modal-footer/EmployeeModalFooter";
import { EmployeeFormFields } from "./EmployeeFormFields";
import { useEmployeeForm } from "../../hooks/use-employee.hook";
import { EmployeeFormValues } from "@/modules/employees/modals/validators/employee.validator.schema";

interface EmployeeModalFormProps {
    employee?: Employee;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Employee) => Promise<boolean>;
    positions: { id: number; name: string }[];
    departments: { id: number; name: string }[];
}

export const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
    employee,
    isEditing,
    onClose,
    onSubmit,
    positions,
    departments
}) => {
    const { form } = useEmployeeForm(employee);

    const handleSubmit = async (values: EmployeeFormValues) => {

        const employeeData: Employee = {
            id: employee?.id || undefined,
            dni: values.dni,
            names: values.names,
            paternalSurname: values.paternalSurname,
            maternalSurname: values.maternalSurname,
            gender: values.gender,
            positionId: values.positionId,
            departmentId: values.departmentId
        };

        const success = await onSubmit(employeeData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <EmployeeFormFields 
                        form={form} 
                        positions={positions}
                        departments={departments}
                    />
                </div>
                <EmployeeModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};