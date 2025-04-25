import React, { createContext, useContext, ReactNode } from "react";
import {
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnDef
} from "@tanstack/react-table";
import { useRoleTable } from "../hooks/use-role-table.hook";
import { useRoleContainerHook } from "../hooks/use-role-container.hook";
import { RoleModel } from "../models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface RoleTableContextType {
    roles: RoleModel[];
    paginationMeta: PaginationMetaModel;
    dataVersion: number;
    currentPage: number;
    searchTerm: string;
    isLoading: boolean;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
    rowSelection: Record<string, boolean>;
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    pagination: { pageIndex: number; pageSize: number };
    setPagination: (updatedPagination: { pageIndex: number; pageSize: number }) => void;
    columns: ColumnDef<RoleModel>[];
    tableVariants: {
        initial: { opacity: number; scale: number };
        animate: { opacity: number; scale: number };
        exit: { opacity: number; scale: number };
    };
    isEmpty: boolean;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
}

const RoleTableContext = createContext<RoleTableContextType | undefined>(undefined);

export const RoleTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const containerHook = useRoleContainerHook();
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
        handlePageChange: onPageChange
    } = containerHook;

    console.log("RoleTableProvider - roles:", roles);
    console.log("RoleTableProvider - paginationMeta:", paginationMeta);

    const {
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        pagination,
        setPagination,
        columns,
        tableVariants,
        isEmpty
    } = useRoleTable({
        roles,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onSearchChange,
        onPageChange
    });

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
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        pagination,
        setPagination,
        columns,
        tableVariants,
        isEmpty
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