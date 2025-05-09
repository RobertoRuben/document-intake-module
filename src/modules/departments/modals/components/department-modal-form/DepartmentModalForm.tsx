import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Department } from "@/modules/departments/models/department.model";
import { DepartmentModalFooter } from "../department-modal-footer/DepartmentModalFooter";
import { DepartmentFormFields } from "./DepartmentFormFields";
import { useDepartmentForm } from "../../hooks/use-department.hook";
import { DepartmentFormValues } from "@/modules/departments/modals/validators/department.validator.schema";

interface DepartmentModalFormProps {
    department?: Department;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Department) => Promise<boolean>;
}

export const DepartmentModalForm: React.FC<DepartmentModalFormProps> = ({
    department,
    isEditing,
    onClose,
    onSubmit,
}) => {

    const { form } = useDepartmentForm(department);

    const handleSubmit = async (values: DepartmentFormValues) => {
        const departmentData: Department = {
            id: department?.id || undefined,
            name: values.name,
        };

        const success = await onSubmit(departmentData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <DepartmentFormFields form={form} />
                </div>
                <DepartmentModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};