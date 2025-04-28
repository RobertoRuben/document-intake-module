import React from "react";
import { DepartmentHeaderTitle } from "@/modules/departments/components/department-header/DepartmentHeaderTitle.tsx";
import { AddDepartmentButton } from "./AddDepartmentButton";

interface DepartmentHeaderProps{
    onAddClick: () => void;
}

export const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <DepartmentHeaderTitle />
            <AddDepartmentButton onClick={onAddClick} />
        </div>
    )
}