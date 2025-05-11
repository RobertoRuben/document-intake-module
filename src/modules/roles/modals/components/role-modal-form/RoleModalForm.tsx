import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Role } from "@/modules/roles/models/role.model";
import { RoleModalFooter } from "../role-modal-footer/RoleModalFooter";
import { RoleFormFields } from "./RoleFormFields";
import { useRoleForm} from "@/modules/roles/modals/hooks/use-role.hook";
import { RoleFormValues} from "@/modules/roles/modals/validators/role.validator.schema.ts";

interface RoleModalFormProps {
    role?: Role;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Role) => Promise<boolean>; 
}

export const RoleModalForm: React.FC<RoleModalFormProps> = ({
                                                                role,
                                                                isEditing,
                                                                onClose,
                                                                onSubmit,
                                                            }) => {
    const { form } = useRoleForm(role);

    const handleSubmit = async (values: RoleFormValues) => {
        const roleData: Role = {
            id: role?.id || undefined,
            name: values.name,
        };
        
        const success = await onSubmit(roleData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <RoleFormFields form={form} />
                </div>
                <RoleModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};