import { Button } from "@/modules/core/components/ui/button";
import { Save } from "lucide-react";

interface SubmitButtonProps {
    isEditing: boolean;
    onSubmit: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isEditing, onSubmit }) => {
    return (
        <Button
            type="submit"
            onClick={onSubmit}
            className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center"
        >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? "Guardar Cambios" : "Registrar"}
        </Button>
    );
};