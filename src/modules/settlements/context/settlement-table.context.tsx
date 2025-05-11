import React, { createContext, useContext, ReactNode } from "react";
import { useSettlementTable } from "../hooks/use-settlement-table.hook";
import { useSettlementContext } from "./settlement.context";
import { Settlement } from "../model/settlement.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface SettlementTableContextType {
    settlements: Settlement[];
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

const SettlementTableContext = createContext<SettlementTableContextType | undefined>(undefined);

export const SettlementTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        settlements,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditSettlement: onEdit,
        handleDeleteSettlement: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleSettlements
    } = useSettlementContext();

    const tableHookProps = useSettlementTable({
        settlements,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleSettlements,
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: SettlementTableContextType = {
        settlements,
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
        <SettlementTableContext.Provider value={value}>
            {children}
        </SettlementTableContext.Provider>
    );
};

export const useSettlementTableContext = (): SettlementTableContextType => {
    const context = useContext(SettlementTableContext);
    if (context === undefined) {
        throw new Error("useSettlementTableContext debe usarse dentro de un SettlementTableProvider");
    }
    return context;
};