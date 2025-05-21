import React from "react";
import { DepartmentConnectionTitle } from "./DepartmentConnectionTitle";
import { AddButton } from "@/globals/components/AddButton";

interface DepartmentConnectionHeaderProps {
    onAddClick: () => void;
}

export const DepartmentConnectionHeader: React.FC<DepartmentConnectionHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <DepartmentConnectionTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Conexión"
            />
        </div>
    )
}