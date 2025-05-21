import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { DepartmentConnection } from "@/modules/department-connections/model/department-connection.model";
import { DepartmentConnectionModalFooter } from "../connection-modal-footer/DepartmentConnectionModalFooter";
import { DepartmentConnectionFormFields } from "./DepartmentConnectionFormFields";
import { useDepartmentConnectionForm } from "../../hooks/use-department-connection.hook";
import { DepartmentConnectionFormValues } from "@/modules/department-connections/modals/validators/department-connection.validator.schema";

interface DepartmentConnectionModalFormProps {
    departmentConnection?: DepartmentConnection;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: DepartmentConnection) => Promise<boolean>;
    departments: { id: number; name: string }[];
}

export const DepartmentConnectionModalForm: React.FC<DepartmentConnectionModalFormProps> = ({
    departmentConnection,
    isEditing,
    onClose,
    onSubmit,
    departments,
}) => {
    const { form } = useDepartmentConnectionForm(departmentConnection);

    const handleSubmit = async (values: DepartmentConnectionFormValues) => {
        const connectionData: DepartmentConnection = {
            id: departmentConnection?.id || undefined,
            sourceDepartmentId: values.sourceDepartmentId,
            targetDepartmentId: values.targetDepartmentId,
            sourceDepartmentName: departmentConnection?.sourceDepartmentName,
            targetDepartmentName: departmentConnection?.targetDepartmentName,
            createdAt: departmentConnection?.createdAt,
            updatedAt: departmentConnection?.updatedAt,
        };

        const success = await onSubmit(connectionData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <DepartmentConnectionFormFields 
                        form={form} 
                        departments={departments}
                    />
                </div>
                <DepartmentConnectionModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};