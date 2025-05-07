import React from "react";
import { PositionHeaderTitle } from "@/modules/positions/components/position-header/PositionHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface PositionHeaderProps {
    onAddClick: () => void;
}

export const PositionHeader: React.FC<PositionHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <PositionHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Cargo"
            />
        </div>
    )
}