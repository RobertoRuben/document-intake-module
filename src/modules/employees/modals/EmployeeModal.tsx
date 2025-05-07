import { EmployeeModalForm } from "./components/employee-modal-form/EmployeeModalForm";
import { Employee } from "../models/employee.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { EmployeeModalHeader } from "./components/employee-modal-header/EnployeeModalHeader";

interface EmployeeModalProps {
    isOpen: boolean;
    employee?: Employee;
    onClose: () => void;
    onSubmit: (data: Employee) => Promise<boolean>;
    positions: { id: number; name: string }[];
    departments: { id: number; name: string }[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    employee,
    onClose,
    onSubmit,
    positions,
    departments
}) => {
    const [internalEmployee, setInternalEmployee] = useState<Employee | undefined>(employee);
    const isEditing = !!internalEmployee;

    useEffect(() => {
        if (isOpen) {
            setInternalEmployee(employee);
        }
    }, [isOpen, employee]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <EmployeeModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <EmployeeModalForm 
                        employee={internalEmployee}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                        positions={positions}
                        departments={departments}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};