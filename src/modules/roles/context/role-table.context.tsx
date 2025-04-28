import React, { createContext, useContext, ReactNode } from "react";
import { useRoleTable } from "../hooks/use-role-table.hook";
import { useRoleContext } from "./role.context";
import { RoleModel } from "../models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model.ts";

interface RoleTableContextType {
    roles: RoleModel[];
    paginationMeta: PaginationMetaModel;
    dataVersion: number;
    currentPage: number;
    searchTerm: string;
    isLoading: boolean;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onSearchChange: (searchTerm: string) => void;
    onPageChange: (page: number) => void;
    [key: string]: unknown;
}

const RoleTableContext = createContext<RoleTableContextType | undefined>(undefined);

export const RoleTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        roles,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditRole: onEdit,
        handleDeleteRole: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleRoles
    } = useRoleContext();

    const tableHookProps = useRoleTable({
        roles,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleRoles, // Añadir esta línea
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: RoleTableContextType = {
        roles,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        onEdit,
        onDelete,
        onSearchChange,
        onPageChange,
        ...restTableHookProps
    };

    return (
        <RoleTableContext.Provider value={value}>
            {children}
        </RoleTableContext.Provider>
    );
};

export const useRoleTableContext = (): RoleTableContextType => {
    const context = useContext(RoleTableContext);
    if (context === undefined) {
        throw new Error("useRoleTableContext debe usarse dentro de un RoleTableProvider");
    }
    return context;
};