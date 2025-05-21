/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, ReactNode } from "react";
import { useDepartmentConnectionTable } from "../hooks/use-department-connection-table.hook";
import { DepartmentConnection } from "../model/department-connection.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { useDepartmentConnectionsContext } from "./department-connections.context";

interface DepartmentConnectionTableContextType {
    departmentConnections: DepartmentConnection[];
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

const DepartmentConnectionTableContext = createContext<DepartmentConnectionTableContextType | undefined>(undefined);

export const DepartmentConnectionTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        departmentConnections,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditDepartmentConnection: onEdit,
        handleDeleteDepartmentConnection: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleDepartmentConnections
    } = useDepartmentConnectionsContext();

    const tableHookProps = useDepartmentConnectionTable({
        departmentConnections,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleDepartmentConnections,
        onSearchChange,
        onPageChange
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 
        dataVersion: dataVersionDup, 
        searchTerm: searchTermDup, 
        onSearchChange: onSearchChangeDup, 
        departmentConnections: connectionsFromTable, 
        ...restTableHookProps 
    } = tableHookProps;

    const value: DepartmentConnectionTableContextType = {
        departmentConnections,
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
        <DepartmentConnectionTableContext.Provider value={value}>
            {children}
        </DepartmentConnectionTableContext.Provider>
    );
};

export const useDepartmentConnectionTableContext = (): DepartmentConnectionTableContextType => {
    const context = useContext(DepartmentConnectionTableContext);
    if (context === undefined) {
        throw new Error("useDepartmentConnectionTableContext debe usarse dentro de un DepartmentConnectionTableProvider");
    }
    return context;
};