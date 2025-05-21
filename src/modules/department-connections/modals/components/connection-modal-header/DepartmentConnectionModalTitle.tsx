import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface DepartmentConnectionModalTitleProps {
    isEditing: boolean;
}

export const DepartmentConnectionModalTitle: React.FC<DepartmentConnectionModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Conexión" : "Registrar Conexión"}
        </DialogTitle>
    );
}