import React, { createContext, useContext, ReactNode } from "react";
import { useHamletTable } from "../hooks/use-hamlet-table.hook";
import { useHamletContainerHook } from "../hooks/use-hamlet-container.hook";
import { Hamlet } from "../model/hamlet.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface HamletTableContextType {
    hamlets: Hamlet[];
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

const HamletTableContext = createContext<HamletTableContextType | undefined>(undefined);

export const HamletTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        hamlets,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditHamlet: onEdit,
        handleDeleteHamlet: onDelete,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleHamlets
    } = useHamletContainerHook();

    const tableHookProps = useHamletTable({
        hamlets,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onBulkDelete: handleDeleteMultipleHamlets,
        onSearchChange,
        onPageChange
    });    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, hamlets: hamletsFromTable, ...restTableHookProps } = tableHookProps;

    const value: HamletTableContextType = {
        hamlets,
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
        <HamletTableContext.Provider value={value}>
            {children}
        </HamletTableContext.Provider>
    );
};

export const useHamletTableContext = (): HamletTableContextType => {
    const context = useContext(HamletTableContext);
    if (context === undefined) {
        throw new Error("useHamletTableContext debe usarse dentro de un HamletTableProvider");
    }
    return context;
};