import React from "react";
import { SettlementHeaderTitle } from "@/modules/settlement/components/settlement-header/SettlementHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface SettlementHeaderProps {
    onAddClick: () => void;
}

export const SettlementHeader: React.FC<SettlementHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <SettlementHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Asentamiento"
            />
        </div>
    )
}