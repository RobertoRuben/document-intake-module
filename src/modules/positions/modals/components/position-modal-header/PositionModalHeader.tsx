import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { PositionModalTitle } from "./PositionModalTitle";
import { PositionModalDescription } from "./PositionModalDescription";

interface PositionModalHeaderProps {
    isEditing: boolean;
}

export const PositionModalHeader: React.FC<PositionModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <PositionModalTitle isEditing={isEditing} />
            <PositionModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}