import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { EmployeeModalTitle } from "./EmployeeModalTitle";
import { EmployeeModalDescription } from "./EmployeeModalDescription";

interface EmployeeModalHeaderProps {
    isEditing: boolean;
}

export const EmployeeModalHeader: React.FC<EmployeeModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <EmployeeModalTitle isEditing={isEditing} />
            <EmployeeModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}