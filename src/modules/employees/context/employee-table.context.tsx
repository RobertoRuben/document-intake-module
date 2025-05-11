import React, { createContext, useContext, ReactNode } from "react";
import { useEmployeeTable } from "../hooks/use-employee-table.hook";
import { useEmployeeContext } from "./employee.context";
import { Employee } from "../models/employee.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface EmployeeTableContextType {
    employees: Employee[];
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

const EmployeeTableContext = createContext<EmployeeTableContextType | undefined>(undefined);

export const EmployeeTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {    const {
        employees,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditEmployee: onEdit,
        handleDeleteEmployee: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleEmployees
    } = useEmployeeContext();

    const tableHookProps = useEmployeeTable({
        employees,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleEmployees,
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: EmployeeTableContextType = {
        employees,
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
        <EmployeeTableContext.Provider value={value}>
            {children}
        </EmployeeTableContext.Provider>
    );
};

export const useEmployeeTableContext = (): EmployeeTableContextType => {
    const context = useContext(EmployeeTableContext);
    if (context === undefined) {
        throw new Error("useEmployeeTableContext debe usarse dentro de un EmployeeTableProvider");
    }
    return context;
};