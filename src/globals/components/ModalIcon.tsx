import { Edit, Plus } from "lucide-react";

interface ModalIconProps {
    isEditing: boolean;
}

export const ModalIcon: React.FC<ModalIconProps> = ({ isEditing }) => {
    return isEditing ? (
        <Edit className="mr-2 h-6 w-6" />
    ): (
        <Plus className="mr-2 h-6 w-6" />
    );
};