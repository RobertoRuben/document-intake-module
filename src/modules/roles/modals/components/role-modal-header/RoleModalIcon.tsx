import { Edit, Plus } from "lucide-react";

interface RoleModalIconProps {
    isEditing: boolean;
}

export const RoleModalIcon: React.FC<RoleModalIconProps> = ({ isEditing }) => {
    return isEditing ? (
        <Edit className="mr-2 h-6 w-6" />
    ) : (
        <Plus className="mr-2 h-6 w-6" />
    );
};