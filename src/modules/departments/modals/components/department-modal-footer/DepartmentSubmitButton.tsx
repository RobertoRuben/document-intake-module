import { Button } from "@/modules/core/components/ui/button";
import { Save } from "lucide-react";

interface DepartmentSubmitButtonProps {
    isEditing: boolean;
    onSubmit: () => void;
}

export const DepartmentSubmitButton: React.FC<DepartmentSubmitButtonProps> = ({ isEditing, onSubmit }) => {
    return (
        <Button
            type="submit"
            onClick={onSubmit}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
        >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? "Guardar Cambios" : "Registrar"}
        </Button>
    );
};