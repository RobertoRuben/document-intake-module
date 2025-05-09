import { DepartmentModalForm } from "./components/department-modal-form/DepartmentModalForm";
import { Department } from "../models/department.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { DepartmentModalHeader } from "./components/department-modal-header/DepartmentModalHeader";

interface DepartmentModalProps {
    isOpen: boolean;
    department?: Department;
    onClose: () => void;
    onSubmit: (data: Department) => Promise<boolean>;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
    isOpen,
    department,
    onClose,
    onSubmit
}) => {

    const [internalDepartment, setInternalDepartment] = useState<Department | undefined>(department);
    const isEditing = !!internalDepartment;

    useEffect(() => {
        if (isOpen) {
            setInternalDepartment(department);
        }
    }, [isOpen, department]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <DepartmentModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <DepartmentModalForm 
                        department={internalDepartment}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};