import { Edit, Plus } from "lucide-react";

interface DepartmentModalIconProps {
    isEditing: boolean;
}

export const DepartmentModalIcon: React.FC<DepartmentModalIconProps> = ({ isEditing }) => {
    return isEditing ? (
        <Edit className="mr-2 h-6 w-6" />
    ): (
        <Plus className="mr-2 h-6 w-6" />
    );
};