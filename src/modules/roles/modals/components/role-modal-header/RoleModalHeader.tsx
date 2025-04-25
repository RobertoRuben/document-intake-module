import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { RoleModalTitle } from "./RoleModalTitle";
import { RoleModalDescription } from "./RoleModalDescription";

interface RoleModalHeaderProps {
    isEditing: boolean;
}

export const RoleModalHeader: React.FC<RoleModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <RoleModalTitle isEditing={isEditing} />
            <RoleModalDescription isEditing={isEditing} />
        </DialogHeader>
    );
};