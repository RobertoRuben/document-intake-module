import React, {useState} from "react";
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
import { EmptyRoleMessage } from "./EmptyRoleMessage";
import { RoleSearchInput } from "./RoleSearchInput";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";
import { TablePagination } from "./TablePagination";
import { BulkDeleteButton } from "@/globals/components/BulkDeleteButton";
import { ExportToExcelButton } from "@/globals/components/ExportToExcelButton";
import { useRoleTableContext } from "@/modules/roles/context/role-table.context";
import { useRoleContext } from "@/modules/roles/context/role.context";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

interface RoleTableContextType {
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
    columns: ColumnDef<RoleModel, unknown>[];
    tableVariants: Variants;
    dataVersion: number;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    handleBulkDelete: () => void;
    getSelectedRoleIds?: () => number[];
}

interface ExtendedRoleTableContext extends RoleTableContextType {
    roles: RoleModel[];
    paginationMeta: PaginationMetaModel;
}

export const RoleTable: React.FC = () => {
    const [localLoading, setLocalLoading] = useState(false);
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
        getSelectedRoleIds
    } = useRoleTableContext() as unknown as RoleTableContextType;

    const context = useRoleTableContext() as unknown as ExtendedRoleTableContext;
    const { roles, paginationMeta } = context;
    const { handleExportToExcel: exportToExcel, isLoading } = useRoleContext();

    const handleExportToExcel = async () => {
        if (getSelectedRoleIds) {
            const selectedIds = getSelectedRoleIds();
            if (selectedIds.length > 0) {
                try {
                    await exportToExcel(selectedIds);
                } catch (error) {
                    console.error("Error al exportar los roles:", error);
                    toast.error("Error de exportación", {
                        description: "No se pudieron exportar los roles seleccionados."
                    });
                }
            } else {
                toast.warning("Selección vacía", {
                    description: "No hay roles seleccionados para exportar"
                });
            }
        }
    };

    const handleBulkDeleteWithLoading = async () => {
        if (getSelectedRoleIds) {
            const selectedIds = getSelectedRoleIds();
            if (selectedIds.length > 0) {
                setLocalLoading(true);
                try {
                    await handleBulkDelete();
                } finally {
                    setLocalLoading(false);
                }
            } else {
                toast.warning("Selección vacía", {
                    description: "No hay roles seleccionados para eliminar"
                });
            }
        }
    };

    const table = useReactTable({
        data: roles || [],
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
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        pageCount: paginationMeta?.totalPages || 0,
    });

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 py-4 md:hidden">
                <div className="w-full">
                    <RoleSearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                </div>
                
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
                                onDelete={handleBulkDeleteWithLoading}
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
            </div>
            
            <div className="hidden md:flex md:items-center md:justify-between gap-4 py-4">
                <div className="w-full md:w-1/2 lg:w-1/3">
                    <RoleSearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                    />
                </div>
                
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
                                onDelete={handleBulkDeleteWithLoading}
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
                                {table.getRowModel().rows?.length ? (
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
                                            <EmptyRoleMessage />
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
                pageSize={paginationMeta?.perPage || 10}
                selectedCount={context.totalSelectedRows}
                onPageChange={(pageIndex) => {
                    if (!isNaN(pageIndex) && typeof pageIndex === 'number') {
                        table.setPageIndex(pageIndex);
                        setPagination({
                            pageIndex: pageIndex,
                            pageSize: table.getState().pagination.pageSize
                        });
                    }
                }}
            />
        </div>
    );
};