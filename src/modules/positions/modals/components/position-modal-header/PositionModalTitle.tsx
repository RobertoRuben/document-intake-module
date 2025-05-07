import { PositionModalIcon } from "./PositionModalIcon";
import { DialogTitle } from "@/modules/core/components/ui/dialog";

interface PositionModalTitleProps {
    isEditing: boolean;
}

export const PositionModalTitle: React.FC<PositionModalTitleProps> = ({ isEditing }) => {
    return (
        <DialogTitle className="text-2xl font-bold flex items-center">
            <PositionModalIcon isEditing={isEditing} />
            {isEditing ? "Editar Cargo" : "Registrar Cargo"}
        </DialogTitle>
    );
}