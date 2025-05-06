import React from "react";
import { Button } from "@/modules/core/components/ui/button";
import { XCircle } from "lucide-react";

interface ModalCancelButtonProps {
    onClose: () => void;
    className?: string;
    text?: string;
    icon?: React.ReactNode;
}

export const ModalCancelButton: React.FC<ModalCancelButtonProps> = ({ 
    onClose,
    className = "w-full bg-[#d82f2f] text-white hover:bg-[#991f1f] flex items-center justify-center",
    text = "Cancelar",
    icon = <XCircle className="w-5 h-5 mr-2" />
}) => {
    return (
        <Button
            type="button"
            onClick={onClose}
            className={className}
        >
            {icon}
            {text}
        </Button>
    );
};