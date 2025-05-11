import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { UserModalTitle } from "./UserModalTitle";
import { UserModalDescription } from "./UserModalDescription";

interface UserModalHeaderProps {
    isEditing: boolean;
}

export const UserModalHeader: React.FC<UserModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <UserModalTitle isEditing={isEditing} />
            <UserModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}