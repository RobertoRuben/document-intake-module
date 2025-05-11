import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { SettlementModalTitle } from "./SettlementModalTitle";
import { SettlementModalDescription } from "./SettlementModalDescription";

interface SettlementModalHeaderProps {
    isEditing: boolean;
}

export const SettlementModalHeader: React.FC<SettlementModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <SettlementModalTitle isEditing={isEditing} />
            <SettlementModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}