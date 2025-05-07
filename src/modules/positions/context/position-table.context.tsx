import React, { createContext, useContext, ReactNode } from "react";
import { usePositionTable } from "../hooks/use-position-table.hook";
import { usePositionContext } from "./position.context";
import { Position } from "../model/position.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface PositionTableContextType {
    positions: Position[];
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

const PositionTableContext = createContext<PositionTableContextType | undefined>(undefined);

export const PositionTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        positions,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditPosition: onEdit,
        handleDeletePosition: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultiplePositions
    } = usePositionContext();

    const tableHookProps = usePositionTable({
        positions,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultiplePositions,
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: PositionTableContextType = {
        positions,
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
        <PositionTableContext.Provider value={value}>
            {children}
        </PositionTableContext.Provider>
    );
};

export const usePositionTableContext = (): PositionTableContextType => {
    const context = useContext(PositionTableContext);
    if (context === undefined) {
        throw new Error("usePositionTableContext debe usarse dentro de un PositionTableProvider");
    }
    return context;
};