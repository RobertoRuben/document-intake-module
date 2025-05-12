import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface HamletModalTitleProps {
    isEditing: boolean;
}

export const HamletModalTitle: React.FC<HamletModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Caserio" : "Registrar Caserio"}
        </DialogTitle>
    );
}