import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface UserModalTitleProps {
    isEditing: boolean;
}

export const UserModalTitle: React.FC<UserModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Usuario" : "Registrar Usuario"}
        </DialogTitle>
    );
}