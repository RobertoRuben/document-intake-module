import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface DocumentaryTopicModalTitleProps {
    isEditing: boolean;
}

export const DocumentaryTopicModalTitle: React.FC<DocumentaryTopicModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Tema Documental" : "Registrar Tema Documental"}
        </DialogTitle>
    );
}