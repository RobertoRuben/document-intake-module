import React, { createContext, useContext, ReactNode } from "react";
import { useDepartmentTable } from "../hooks/use-department-table.hook";
import { useDepartmentContext } from "./department.context";
import { DepartmentModel } from "../models/department.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model.ts";

interface DepartmentTableContextType {
    departments: DepartmentModel[];
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

const DepartmentTableContext = createContext<DepartmentTableContextType | undefined>(undefined);

export const DepartmentTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        departments,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditDepartment: onEdit,
        handleDeleteDepartment: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleDepartments
    } = useDepartmentContext();

    const tableHookProps = useDepartmentTable({
        departments,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleDepartments,
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: DepartmentTableContextType = {
        departments,
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
        <DepartmentTableContext.Provider value={value}>
            {children}
        </DepartmentTableContext.Provider>
    );
};

export const useDepartmentTableContext = (): DepartmentTableContextType => {
    const context = useContext(DepartmentTableContext);
    if (context === undefined) {
        throw new Error("useDepartmentTableContext debe usarse dentro de un DepartmentTableProvider");
    }
    return context;
};