import { UserModalForm } from "./components/user-modal-form/UserModalForm";
import { User } from "../models/user.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { UserModalHeader } from "./components/user-modal-header/UserModalHeader";
import { Role } from "@/modules/roles/models/role.model";
import { Employee } from "@/modules/employees/models/employee.model";

interface UserModalProps {
    isOpen: boolean;
    user?: User;
    onClose: () => void;
    onSubmit: (data: User) => Promise<boolean>;
    roles: Role[];
    employees: Employee[];
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    user,
    onClose,
    onSubmit,
    roles,
    employees
}) => {
    const [internalUser, setInternalUser] = useState<User | undefined>(user);
    const isEditing = !!internalUser;

    useEffect(() => {
        if (isOpen) {
            setInternalUser(user);
        }
    }, [isOpen, user]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    // Transforma Role[] en {id: number, name: string}[]
    const rolesForDropdown = roles.map(role => ({
        id: role.id || 0,
        name: role.name
    }));

    // Transforma Employee[] en {id: number, name: string}[]
    const employeesForDropdown = employees.map(employee => ({
        id: employee.id || 0,
        name: `${employee.names} ${employee.paternalSurname} ${employee.maternalSurname}`
    }));

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <UserModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <UserModalForm 
                        user={internalUser}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                        roles={rolesForDropdown}
                        employees={employeesForDropdown}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};