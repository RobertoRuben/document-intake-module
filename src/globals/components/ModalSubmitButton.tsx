import React from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface ModalSubmitButtonProps {
    onSubmit?: () => void;
    isEditing?: boolean;
    className?: string;
    saveText?: string;
    createText?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
}

export const ModalSubmitButton: React.FC<ModalSubmitButtonProps> = ({ 
    onSubmit,
    isEditing = false,
    className = "w-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center",
    saveText = "Guardar Cambios",
    createText = "Registrar",
    icon = <Save className="w-5 h-5 mr-2" />,
    isLoading = false,
    loadingText = "Procesando..."
}) => {
    return (
        <Button
            type="submit"
            onClick={onSubmit}
            className={className}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {icon}
                    {isEditing ? saveText : createText}
                </>
            )}
        </Button>
    );
};