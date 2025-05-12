import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { HamletModalTitle } from "./HamletModalTitle";
import { HamletModalDescription } from "./HamletModalDescription";

interface HamletModalHeaderProps {
    isEditing: boolean;
}

export const HamletModalHeader: React.FC<HamletModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <HamletModalTitle isEditing={isEditing} />
            <HamletModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}