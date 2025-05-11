import { useState, useMemo, useEffect } from "react";
import {
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnDef,
    RowSelectionState
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import { Checkbox } from "@/modules/core/components/ui/checkbox";
import { User, UserStatus } from "@/modules/users/models/user.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { formatDateLima } from "@/globals/utils/dateUtils";
import { Badge } from "@/modules/core/components/ui/badge";
import { UserStatus as FilterStatus } from "@/globals/components/UserStatusFilter";

interface UseUserTableProps {
    users: User[];
    dataVersion: number;
    paginationMeta: PaginationMetaModel;
    searchTerm: string;
    statusFilter: FilterStatus;
    onEdit: (id?: number) => void;
    onDelete: (id?: number) => void;
    onChangeStatus?: (id: number, status: UserStatus) => void;
    onBulkDelete?: (ids: number[]) => void;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (status: FilterStatus) => void;
    onPageChange: (page: number) => void;
}

export const useUserTable = ({
    users,
    dataVersion,
    paginationMeta,
    searchTerm,
    statusFilter,
    onEdit,
    onDelete,
    onChangeStatus,
    onBulkDelete,
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
}: UseUserTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        createdAt: false,
        updatedAt: false,
        isActive: true,
        username: true,
        employeeName: true,
        roleName: true,
        actions: true,
    });
    
    const [selectedUserIds, setSelectedUserIds] = useState<Record<number, boolean>>({});
    const [totalSelectedRows, setTotalSelectedRows] = useState<number>(0);
    const [allSelected, setAllSelected] = useState<boolean>(false);

    const [pagination, setPagination] = useState({
        pageIndex: (paginationMeta?.currentPage || 1) - 1,
        pageSize: paginationMeta?.perPage || 5,
    });

    useEffect(() => {
        setColumnVisibility(prev => ({
            ...prev,
            actions: totalSelectedRows === 0
        }));
    }, [totalSelectedRows]);

    // Usamos este efecto para sincronizar el filtro de estado con los filtros de columna
    useEffect(() => {
        if (statusFilter === 'all') {
            setColumnFilters(filters => filters.filter(f => f.id !== 'isActive'));
        } else if (statusFilter === 'active') {
            setColumnFilters(filters => {
                const newFilters = filters.filter(f => f.id !== 'isActive');
                newFilters.push({ id: 'isActive', value: true });
                return newFilters;
            });
        } else if (statusFilter === 'inactive') {
            setColumnFilters(filters => {
                const newFilters = filters.filter(f => f.id !== 'isActive');
                newFilters.push({ id: 'isActive', value: false });
                return newFilters;
            });
        }
    }, [statusFilter]);

    const rowSelection = useMemo(() => {
        const selection: RowSelectionState = {};
        users.forEach((user, index) => {
            if (user.id !== undefined && (selectedUserIds[user.id] || allSelected)) {
                selection[index] = true;
            }
        });
        return selection;
    }, [users, selectedUserIds, allSelected]);

    useEffect(() => {
        if (allSelected && paginationMeta?.total) {
            setTotalSelectedRows(paginationMeta.total);
        } else {
            const selectedCount = Object.values(selectedUserIds).filter(Boolean).length;
            setTotalSelectedRows(selectedCount);
        }
    }, [selectedUserIds, paginationMeta?.total, allSelected]);

    const getSelectedUserIds = (): number[] => {
        if (allSelected) {
            return users.map(user => user.id as number);
        } else {
            return Object.keys(selectedUserIds)
                .filter(id => selectedUserIds[Number(id)])
                .map(id => Number(id));
        }
    };

    const handleBulkDelete = () => {        const selectedIds = getSelectedUserIds();
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
            setAllSelected(false);
            setSelectedUserIds({});
            setTotalSelectedRows(0);
        }
    };

    const handleRowSelectionChange = (newSelection: RowSelectionState) => {
        const newSelectedUserIds = { ...selectedUserIds };
        
        Object.entries(newSelection).forEach(([indexStr, isSelected]) => {
            const index = parseInt(indexStr, 10);
            const user = users[index];
            
            if (user && typeof user.id === 'number') {
                if (isSelected) {
                    newSelectedUserIds[user.id] = true;
                } else {
                    delete newSelectedUserIds[user.id];
                }
            }
        });
        
        const allCurrentPageSelected = 
            users.length > 0 && 
            users.every(user => typeof user.id === 'number' && newSelectedUserIds[user.id]);
            
        if (allCurrentPageSelected && Object.keys(newSelectedUserIds).length === paginationMeta?.total) {
            setAllSelected(true);
        } else if (Object.keys(newSelectedUserIds).length === 0) {
            setAllSelected(false);
        }
        
        setSelectedUserIds(newSelectedUserIds);
    };    const formatStatus = (status: UserStatus | boolean) => {
        if (typeof status === 'boolean') {
            return status ? (
                <Badge className="bg-green-600 hover:bg-green-700">
                    Activo
                </Badge>
            ) : (
                <Badge className="bg-red-600 hover:bg-red-700">
                    Inactivo
                </Badge>
            );
        }
        
        // Manejo de valores de enumeración
        switch (status) {
            case UserStatus.ACTIVATE:
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        Activo
                    </Badge>
                );
            case UserStatus.DEACTIVATE:
                return (
                    <Badge className="bg-red-600 hover:bg-red-700">
                        Inactivo
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-500 hover:bg-gray-600">
                        Desconocido
                    </Badge>
                );
        }
    };

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getRowModel().rows.length > 0 &&
                            (allSelected || table.getIsAllRowsSelected())
                        }
                        onCheckedChange={(value) => {
                            table.toggleAllRowsSelected(!!value);
                            
                            if (value) {
                                setAllSelected(true);
                                
                                if (paginationMeta?.total) {
                                    setTotalSelectedRows(paginationMeta.total);
                                }
                            } else {
                                setAllSelected(false);
                                setSelectedUserIds({});
                                setTotalSelectedRows(0);
                            }
                        }}
                        aria-label="Seleccionar todos"
                    />
                ),
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <Checkbox
                            checked={allSelected || (user.id !== undefined && selectedUserIds[user.id] === true)}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value);
                                
                                if (value) {
                                    if (typeof user.id === 'number') {
                                        const id = user.id;
                                        setSelectedUserIds(prev => ({ ...prev, [id.toString()]: true }));
                                    }
                                } else {
                                    setSelectedUserIds(prev => {
                                        const updated = { ...prev };
                                        if (typeof user.id === 'number') {
                                            delete updated[user.id];
                                        }
                                        return updated;
                                    });
                                    
                                    if (allSelected) {
                                        setAllSelected(false);
                                    }
                                }
                            }}
                            aria-label="Seleccionar fila"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "id",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">
                        {String(row.original.id).padStart(5, "0")}
                    </div>
                ),
            },
            {
                accessorKey: "username",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Usuario
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.username}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "employeeName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Empleado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.original.employeeName || 'No asignado'}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "isActive",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Estado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{formatStatus(row.original.isActive)}</div>,
                enableHiding: true,
            },
            {
                accessorKey: "roleName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Rol
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>{row.original.roleName || 'No asignado'}</span>
                    </div>
                ),
                enableHiding: true,
            },
            {
                accessorKey: "createdAt",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de creación
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{formatDateLima(row.original.createdAt)}</div>,
            },
            {
                accessorKey: "updatedAt",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="px-0 font-bold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha de actualización
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{formatDateLima(row.original.updatedAt)}</div>,
            },
            {                id: "actions",
                header: () => <div className="text-right">Acciones</div>,
                cell: ({ row }) => {
                    const user = row.original;
                    // Verificar si isActive es booleano o UserStatus
                    const isActive = typeof user.isActive === 'boolean' 
                        ? user.isActive 
                        : user.isActive === UserStatus.ACTIVATE;
                    
                    return (
                        <div className="text-right space-x-2">
                            {onChangeStatus && (
                                <Button
                                    onClick={() => onChangeStatus(
                                        user.id as number, 
                                        isActive ? UserStatus.DEACTIVATE : UserStatus.ACTIVATE
                                    )}
                                    className={isActive 
                                        ? "bg-orange-500 text-white hover:bg-orange-600" 
                                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                                    }
                                    title={isActive ? "Desactivar usuario" : "Activar usuario"}
                                >
                                    {isActive 
                                        ? <ToggleRight className="w-5 h-5" /> 
                                        : <ToggleLeft className="w-5 h-5" />
                                    }
                                </Button>
                            )}
                            <Button
                                onClick={() => onEdit(user.id)}
                                className="bg-amber-500 text-white hover:bg-amber-600"
                                title="Editar usuario"
                            >
                                <Pencil className="w-5 h-5" />
                            </Button>
                            <Button
                                onClick={() => onDelete(user.id)}
                                className="bg-red-500 text-white hover:bg-red-600"
                                title="Eliminar usuario"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    );
                },
                enableSorting: false,
            },
        ],
        [onEdit, onDelete, onChangeStatus, allSelected, paginationMeta?.total, selectedUserIds]
    );    useEffect(() => {
        // No aplicamos filtros cuando usamos paginación manual
        // Los datos ya vienen filtrados desde el backend
    }, [searchTerm]);    useEffect(() => {
        const backendPageIndex = (paginationMeta?.currentPage || 1) - 1;
        if (pagination.pageIndex !== backendPageIndex) {
            setPagination(prev => ({
                ...prev,
                pageIndex: backendPageIndex
            }));
        }
    }, [paginationMeta?.currentPage, pagination.pageIndex]);

    const handlePaginationChange = (updatedPagination: typeof pagination) => {
        setPagination(updatedPagination);
        if (updatedPagination.pageIndex !== pagination.pageIndex) {
            onPageChange(updatedPagination.pageIndex + 1);
        }
    };

    const tableVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    };    return {
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection: handleRowSelectionChange,
        totalSelectedRows,
        pagination,
        setPagination: handlePaginationChange,
        columns,
        tableVariants,
        isEmpty: users.length === 0,
        dataVersion,
        searchTerm,
        statusFilter,
        onSearchChange,
        onStatusFilterChange,
        allSelected,
        setAllSelected,
        handleBulkDelete,
        getSelectedUserIds,
    };
};