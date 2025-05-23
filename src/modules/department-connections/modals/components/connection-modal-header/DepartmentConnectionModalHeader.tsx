import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { DepartmentConnectionModalTitle } from "./DepartmentConnectionModalTitle";
import { DepartmentConnectionModalDescription } from "./DepartmentConnectionModalDescription";

interface DepartmentConnectionModalHeaderProps {
    isEditing: boolean;
}

export const DepartmentConnectionModalHeader: React.FC<DepartmentConnectionModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <DepartmentConnectionModalTitle isEditing={isEditing} />
            <DepartmentConnectionModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}