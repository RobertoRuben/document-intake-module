import React, { createContext, useContext, ReactNode } from "react";
import { useUserTable } from "../hooks/use-user-table.hook";
import { useUserContext } from "./user.context";
import { User, UserStatus } from "../models/user.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { UserStatus as FilterStatus } from "@/globals/components/UserStatusFilter";

interface UserTableContextType {
    users: User[];
    paginationMeta: PaginationMetaModel;
    dataVersion: number;
    currentPage: number;
    searchTerm: string;
    statusFilter: FilterStatus;
    isLoading: boolean;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onChangeStatus?: (id: number, status: UserStatus) => void;
    onSearchChange: (searchTerm: string) => void;
    onStatusFilterChange: (status: FilterStatus) => void;
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
        statusFilter,
        isLoading,
        handleEditUser: onEdit,
        handleDeleteUser: onDelete,
        handleChangeUserStatus: onChangeStatus,
        handleSearchChange: onSearchChange,
        handleStatusFilterChange: onStatusFilterChange,
        handlePageChange: onPageChange,
        handleDeleteMultipleUsers
    } = useUserContext();

    const tableHookProps = useUserTable({
        users,
        dataVersion,
        paginationMeta,
        searchTerm,
        statusFilter,
        onEdit,
        onDelete,
        onChangeStatus,
        onBulkDelete: handleDeleteMultipleUsers,
        onSearchChange,
        onStatusFilterChange,
        onPageChange
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataVersion: dataVersionDup, searchTerm: searchTermDup, statusFilter: statusFilterDup, onSearchChange: onSearchChangeDup, onStatusFilterChange: onStatusFilterChangeDup, ...restTableHookProps } = tableHookProps;

    const value: UserTableContextType = {
        users,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        statusFilter,
        isLoading,
        onEdit,
        onDelete,
        onChangeStatus,
        onSearchChange,
        onStatusFilterChange,
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