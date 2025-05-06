import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { DepartmentModalTitle } from "./DepartmentModalTitle";
import { DepartmentModalDescription } from "./DepartmentModalDescription";

interface DepartmentModalHeaderProps {
    isEditing: boolean;
}

export const DepartmentModalHeader: React.FC<DepartmentModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <DepartmentModalTitle isEditing={isEditing} />
            <DepartmentModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}