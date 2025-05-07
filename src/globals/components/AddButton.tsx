import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";

interface AddButtonProps {
    onClick: () => void;
    label: string;
    className?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ 
    onClick, 
    label, 
    className = "w-full sm:w-auto px-4 py-2 bg-[#145A32] text-white rounded hover:bg-[#0E3D22] transition-colors duration-200" 
}) => {
    return (
        <Button
            onClick={onClick}
            className={`${className} flex items-center justify-center`}
        >
            <Plus className="w-5 h-5 mr-2" />
            {label}
        </Button>
    )
}