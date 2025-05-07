import React from "react";
import { EmployeeHeaderTitle } from "@/modules/employees/components/employee-header/EmployeeHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface EmployeeHeaderProps {
    onAddClick: () => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <EmployeeHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Empleado"
            />
        </div>
    )
}