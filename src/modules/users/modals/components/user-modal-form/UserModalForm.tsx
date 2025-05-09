import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { User, UserStatus } from "@/modules/users/models/user.model";
import { UserModalFooter } from "../user-modal-footer/UserModalFooter";
import { UserModalFormFields } from "./UserModalFormFields";
import { useUserForm } from "../../hooks/use-user.hook";
import { UserFormValues } from "@/modules/users/modals/validators/user.validator.schema";

interface UserModalFormProps {
    user?: User;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: User) => Promise<boolean>;
    roles: { id: number; name: string }[];
    employees: { id: number; name: string }[];
}

export const UserModalForm: React.FC<UserModalFormProps> = ({
    user,
    isEditing,
    onClose,
    onSubmit,
    roles,
    employees
}) => {
    const { form } = useUserForm(user);

    const handleSubmit = async (values: UserFormValues) => {
        const userData: User = {
            id: user?.id || undefined,
            username: values.username,
            password: values.password || '',
            isActive: values.isActive as UserStatus,
            roleId: values.roleId,
            employeeId: values.employeeId
        };

        const success = await onSubmit(userData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <UserModalFormFields 
                        form={form} 
                        roles={roles}
                        employees={employees}
                        isEditing={isEditing}
                    />
                </div>
                <UserModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};