import { DepartmentConnectionModalForm } from "./components/connection-modal-form/DepartmentConnectionModalForm";
import { DepartmentConnection } from "../model/department-connection.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { DepartmentConnectionModalHeader } from "./components/connection-modal-header/DepartmentConnectionModalHeader";
import { useDepartments } from "@/modules/departments/hooks/use-department.hook";
import { Department } from "@/modules/departments/models/department.model";

interface DepartmentConnectionModalProps {
    isOpen: boolean;
    departmentConnection?: DepartmentConnection;
    onClose: () => void;
    onSubmit: (data: DepartmentConnection) => Promise<boolean>;
    departments?: Department[];
}

export const DepartmentConnectionModal: React.FC<DepartmentConnectionModalProps> = ({
    isOpen,
    departmentConnection,
    onClose,
    onSubmit,
    departments: providedDepartments
}) => {
    const { data: fetchedDepartments, isLoading } = useDepartments();
    const [internalConnection, setInternalConnection] = useState<DepartmentConnection | undefined>(departmentConnection);
    const isEditing = !!internalConnection;
    
    const departments = providedDepartments || fetchedDepartments || [];

    useEffect(() => {
        if (isOpen) {
            setInternalConnection(departmentConnection);
        }
    }, [isOpen, departmentConnection]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };
    
    const departmentsForDropdown = departments.map(department => ({
        id: department.id || 0,
        name: department.name
    }));

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <DepartmentConnectionModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    {!isLoading && (
                        <DepartmentConnectionModalForm 
                            departmentConnection={internalConnection}
                            isEditing={isEditing}
                            onClose={onClose}
                            onSubmit={onSubmit}
                            departments={departmentsForDropdown}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};