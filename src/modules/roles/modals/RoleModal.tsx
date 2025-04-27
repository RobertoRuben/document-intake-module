import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent
} from "@/modules/core/components/ui/dialog";
import { RoleModalHeader } from "./components/role-modal-header/RoleModalHeader";
import { RoleModalForm } from "./components/role-modal-form/RoleModalForm";
import { RoleModel } from "@/modules/roles/models/role.model";

interface RoleModalProps {
    isOpen: boolean;
    role?: RoleModel;
    onClose: () => void;
    onSubmit: (data: RoleModel) => Promise<boolean>;
}

export const RoleModal: React.FC<RoleModalProps> = ({
                                                        isOpen,
                                                        role,
                                                        onClose,
                                                        onSubmit
                                                    }) => {
    // Mantener una copia interna del estado de edición
    const [internalRole, setInternalRole] = useState<RoleModel | undefined>(role);
    const isEditing = !!internalRole;

    useEffect(() => {
        if (isOpen) {
            setInternalRole(role);
        }
    }, [isOpen, role]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]"
            >
                <RoleModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <RoleModalForm
                        role={internalRole}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};