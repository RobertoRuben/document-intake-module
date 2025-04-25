import React, { createContext, useContext } from "react";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { useRoleTable} from "@/modules/roles/hooks/use-role-table.hook.tsx";

interface RoleTableContextProps {
    roles: RoleModel[];
    dataVersion: number;
    paginationMeta: PaginationMetaModel;
    searchTerm: string;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

interface RoleTableProviderProps extends RoleTableContextProps {
    children: React.ReactNode;
}

const RoleTableContext = createContext<ReturnType<typeof useRoleTable> | undefined>(undefined);

export const RoleTableProvider: React.FC<RoleTableProviderProps> = ({
                                                                        children,
                                                                        roles,
                                                                        dataVersion,
                                                                        paginationMeta,
                                                                        searchTerm,
                                                                        onEdit,
                                                                        onDelete,
                                                                        onSearchChange,
                                                                        onPageChange,
                                                                    }) => {
    const roleTableUtils = useRoleTable({
        roles,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onSearchChange,
        onPageChange,
    });

    return (
        <RoleTableContext.Provider value={roleTableUtils}>
            {children}
        </RoleTableContext.Provider>
    );
};

export const useRoleTableContext = () => {
    const context = useContext(RoleTableContext);
    if (context === undefined) {
        throw new Error("useRoleTableContext must be used within a RoleTableProvider");
    }
    return context;
};