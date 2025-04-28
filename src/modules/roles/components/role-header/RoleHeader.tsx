import React from "react";
import { RoleHeaderTitle} from "@/modules/roles/components/role-header/RoleHeaderTitle.tsx";
import { AddRoleButton} from "@/modules/roles/components/role-header/AddRoleButton.tsx";

interface RoleHeaderProps {
    onAddClick: () => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <RoleHeaderTitle />
            <AddRoleButton onClick={onAddClick} />
        </div>
    );
};