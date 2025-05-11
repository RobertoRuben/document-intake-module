import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
    PaginationState,
    OnChangeFn
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/table";
import { useUserTableContext } from "../../context/user-table.context";
import { useUserContext } from "../../context/user.context";
import { User } from "@/modules/users/models/user.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { toast } from "sonner";
import { SearchInput } from "@/globals/components/SearchInput";
import { ColumnVisibilityDropdown } from "@/globals/components/ColumnVisibilityDropDown";
import { TablePagination } from "@/globals/components/TablePagination";
import { BulkDeleteButton } from "@/globals/components/BulkDeleteButton";
import { ExportToExcelButton } from "@/globals/components/ExportToExcelButton";
import { EmptyStateMessage } from "@/globals/components/EmptyStateMessage";
import { UserStatusFilter, UserStatus as FilterStatus } from "@/globals/components/UserStatusFilter";

interface UserTableContextType {
    sorting: SortingState;
    setSorting: OnChangeFn<SortingState>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: OnChangeFn<ColumnFiltersState>;
    columnVisibility: VisibilityState;
    setColumnVisibility: OnChangeFn<VisibilityState>;
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
    totalSelectedRows: number; 
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    columns: ColumnDef<User, unknown>[];
    tableVariants: Variants;
    dataVersion: number;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    handleBulkDelete: () => Promise<void>;
    getSelectedUserIds?: () => number[];
    users: User[];
    paginationMeta: PaginationMetaModel;
    statusFilter?: FilterStatus;
    onStatusFilterChange?: (status: FilterStatus) => void;
}

export const UserTable: React.FC = () => {
    const [localLoading, setLocalLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userStatusFilter, setUserStatusFilter] = useState<FilterStatus>('active');
    
    const {
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        totalSelectedRows,
        pagination,
        setPagination,
        columns,
        tableVariants,
        dataVersion,
        searchTerm,
        onSearchChange,
        handleBulkDelete,
        getSelectedUserIds,
        users,
        paginationMeta,
        onStatusFilterChange
    } = useUserTableContext() as unknown as UserTableContextType;

    const { handleExportToExcel: exportToExcel, isLoading } = useUserContext();

    const handleExportToExcel = async () => {
        if (getSelectedUserIds) {
            const selectedIds = getSelectedUserIds();
            if (selectedIds.length > 0) {                try {
                    await exportToExcel(selectedIds);
                } catch {
                    toast.error("Error de exportación", {
                        description: "No se pudieron exportar los usuarios seleccionados."
                    });
                }
            } else {
                toast.warning("Selección vacía", {
                    description: "No hay usuarios seleccionados para exportar"
                });
            }
        }
    };

    const handleOpenBulkDeleteModal = () => {
        if (getSelectedUserIds) {
            const selectedIds = getSelectedUserIds();
            if (selectedIds.length > 0) {
                setIsDeleteModalOpen(true);
            } else {
                toast.warning("Selección vacía", {
                    description: "No hay usuarios seleccionados para eliminar"
                });
            }
        }
    };

    const handleBulkDeleteWithLoading = async () => {
        setLocalLoading(true);
        try {
            await handleBulkDelete();
            setIsDeleteModalOpen(false);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleStatusFilterChange = (status: FilterStatus) => {
        setUserStatusFilter(status);
        if (onStatusFilterChange) {
            onStatusFilterChange(status);
        }
    };

    const table = useReactTable({
        data: users || [],
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: (updaterOrValue) => {
            const newPagination = typeof updaterOrValue === 'function'
                ? updaterOrValue(pagination)
                : updaterOrValue;

            setPagination(newPagination);
        },        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualFiltering: true, // Deshabilitamos el filtrado automático porque ya viene del backend
        pageCount: paginationMeta?.totalPages || 0,
    });

    return (
        <div className="w-full">            <div className="flex flex-col gap-4 py-4 md:hidden">
                <div className="w-full">
                    <SearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Buscar usuarios..."
                    />
                </div>
                  {!searchTerm && (
                    <div className="w-full">
                        <UserStatusFilter
                            value={userStatusFilter}
                            onChange={handleStatusFilterChange}
                            isMobileView={true}
                        />
                    </div>
                )}

                {totalSelectedRows > 0 && (
                    <>
                        <div className="w-full">
                            <ExportToExcelButton
                                selectedCount={totalSelectedRows}
                                onExport={handleExportToExcel}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="w-full">
                            <BulkDeleteButton
                                selectedCount={totalSelectedRows}
                                onDelete={handleOpenBulkDeleteModal}
                                isLoading={localLoading || isLoading}
                            />
                        </div>
                    </>
                )}
                
                <div className="w-full">
                    <ColumnVisibilityDropdown
                        columns={table.getAllColumns().map((column) => ({
                            id: column.id,
                            isVisible: column.getIsVisible(),
                            toggleVisibility: (value) => column.toggleVisibility(value),
                            getCanHide: () => column.getCanHide(),
                        }))}
                    />
                </div>
            </div>            <div className="hidden md:flex md:items-center md:justify-between gap-4 py-4">
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <SearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Buscar usuarios..."
                    />
                </div>
                
                <div className="flex-grow"></div>
                
                {!searchTerm && (
                    <div className="w-auto md:w-52 mr-4">
                        <UserStatusFilter
                            value={userStatusFilter}
                            onChange={handleStatusFilterChange}
                        />
                    </div>
                )}
                
                <div className="flex items-center gap-2">
                    {totalSelectedRows > 0 && (
                        <>
                            <ExportToExcelButton
                                selectedCount={totalSelectedRows}
                                onExport={handleExportToExcel}
                                isLoading={isLoading}
                            />
                            <BulkDeleteButton
                                selectedCount={totalSelectedRows}
                                onDelete={handleOpenBulkDeleteModal}
                                isLoading={localLoading || isLoading}
                            />
                        </>
                    )}
                    
                    <div className="w-[200px]">
                        <ColumnVisibilityDropdown
                            columns={table.getAllColumns().map((column) => ({
                                id: column.id,
                                isVisible: column.getIsVisible(),
                                toggleVisibility: (value) => column.toggleVisibility(value),
                                getCanHide: () => column.getCanHide(),
                            }))}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${pagination.pageIndex}-${dataVersion}-${searchTerm}`}
                        variants={tableVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="bg-[#145A32] hover:bg-[#0E3D22]">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-white"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading && users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="p-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                                <span className="ml-2">Cargando usuarios...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24">
                                            <EmptyStateMessage 
                                                message="No se encontraron usuarios"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                </AnimatePresence>
            </div>
            <TablePagination
                currentPage={table.getState().pagination.pageIndex}
                totalPages={paginationMeta?.totalPages || 0}
                totalItems={paginationMeta?.total || 0}
                pageSize={paginationMeta?.perPage || 5}
                selectedCount={totalSelectedRows}
                onPageChange={(pageIndex) => {
                    if (!isNaN(pageIndex) && typeof pageIndex === 'number') {
                        table.setPageIndex(pageIndex);
                        setPagination({
                            pageIndex: pageIndex,
                            pageSize: table.getState().pagination.pageSize
                        });
                    }
                }}
                itemName="usuario"
            />
            
            {/* Modal de confirmación para eliminación masiva */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleBulkDeleteWithLoading}
                title="Eliminar usuarios seleccionados"
                description={`¿Estás seguro que deseas eliminar ${totalSelectedRows} ${
                    totalSelectedRows === 1 ? "usuario" : "usuarios"
                } seleccionados? Esta acción no se puede deshacer.`}
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                isLoading={localLoading}
            />
        </div>
    );
};