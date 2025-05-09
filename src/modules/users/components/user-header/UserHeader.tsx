import React from "react";
import { UserHeaderTitle } from "./UserHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface UserHeaderProps {
    onAddClick: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <UserHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Usuario"
            />
        </div>
    )
}