import React, { createContext, useContext, ReactNode } from "react";
import { useUserTable } from "../hooks/use-user-table.hook";
import { useUserContext } from "./user.context";
import { User, UserStatus } from "../models/user.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";

interface UserTableContextType {
    users: User[];
    paginationMeta: PaginationMetaModel;
    dataVersion: number;
    currentPage: number;
    searchTerm: string;
    isLoading: boolean;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onChangeStatus?: (id: number, status: UserStatus) => void;
    onSearchChange: (searchTerm: string) => void;
    onPageChange: (page: number) => void;
    [key: string]: unknown;
}

const UserTableContext = createContext<UserTableContextType | undefined>(undefined);

export const UserTableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        users,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        handleEditUser: onEdit,
        handleDeleteUser: onDelete,
        handleChangeUserStatus: onChangeStatus,
        handleSearchChange: onSearchChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleUsers
    } = useUserContext();

    const tableHookProps = useUserTable({
        users,
        dataVersion,
        paginationMeta,
        searchTerm,
        onEdit,
        onDelete,
        onChangeStatus,
        onBulkDelete: handleDeleteMultipleUsers,
        onSearchChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, onSearchChange: onSearchChangeDup, ...restTableHookProps } = tableHookProps;

    const value: UserTableContextType = {
        users,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isLoading,
        onEdit,
        onDelete,
        onChangeStatus,
        onSearchChange,
        onPageChange,
        ...restTableHookProps
    };

    return (
        <UserTableContext.Provider value={value}>
            {children}
        </UserTableContext.Provider>
    );
};

export const useUserTableContext = (): UserTableContextType => {
    const context = useContext(UserTableContext);
    if (context === undefined) {
        throw new Error("useUserTableContext debe usarse dentro de un UserTableProvider");
    }
    return context;
};