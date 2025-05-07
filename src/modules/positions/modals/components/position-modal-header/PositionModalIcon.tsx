import { Edit, Plus } from "lucide-react";

interface PositionModalIconProps {
    isEditing: boolean;
}

export const PositionModalIcon: React.FC<PositionModalIconProps> = ({ isEditing }) => {
    return isEditing ? (
        <Edit className="mr-2 h-6 w-6" />
    ): (
        <Plus className="mr-2 h-6 w-6" />
    );
};