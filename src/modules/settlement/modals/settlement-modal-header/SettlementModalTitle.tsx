import { ModalIcon } from "@/globals/components/ModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface SettlementModalTitleProps {
    isEditing: boolean;
}

export const SettlementModalTitle: React.FC<SettlementModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <ModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Asentamiento" : "Registrar Asentamiento"}
        </DialogTitle>
    );
}