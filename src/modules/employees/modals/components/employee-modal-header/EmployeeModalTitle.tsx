import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface EmployeeModalTitleProps {
    isEditing: boolean;
}

export const EmployeeModalTitle: React.FC<EmployeeModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Empleado" : "Registrar Empleado"}
        </DialogTitle>
    );
}