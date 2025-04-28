import { RoleModalIcon } from "./RoleModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface RoleModalTitleProps {
    isEditing: boolean;
}

export const RoleModalTitle: React.FC<RoleModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <RoleModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Rol" : "Registrar Rol"}
        </DialogTitle>
    );
};