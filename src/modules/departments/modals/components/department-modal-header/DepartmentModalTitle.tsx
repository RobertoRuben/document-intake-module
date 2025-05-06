import { DepartmentModalIcon } from "./DepartmentModalIcon";
import {DialogTitle} from "@/modules/core/components/ui/dialog";

interface DepartmentModalTitleProps{
    isEditing: boolean;
}

export const DepartmentModalTitle: React.FC<DepartmentModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <DepartmentModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Departamento" : "Registrar Departamento"}
        </DialogTitle>
    );
}