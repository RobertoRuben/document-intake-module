
import React from "react";
import { HamletHeaderTitle } from "@/modules/hamlets/components/hamlet-header/HamletHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface HamletHeaderProps {
    onAddClick: () => void;
}

export const HamletHeader: React.FC<HamletHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <HamletHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Caserío"
            />
        </div>
    )
}