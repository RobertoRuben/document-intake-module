import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface DocumentCategoryModalTitleProps {
    isEditing: boolean;
}

export const DocumentCategoryModalTitle: React.FC<DocumentCategoryModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Categoría" : "Registrar Categoría"}
        </DialogTitle>
    );
}