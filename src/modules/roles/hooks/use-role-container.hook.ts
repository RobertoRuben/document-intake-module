import { useState, useEffect, useCallback, useRef } from "react";
import { roleService } from "@/modules/roles/service/role.service";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginatedRolesResponseModel } from "@/modules/roles/models/role.page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useRoleContainerHook = () => {
    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMetaModel>({
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
        nextPage: null,
        previousPage: null
    });
    const [dataVersion, setDataVersion] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleModel | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<RoleModel | undefined>(undefined);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchRoles = useCallback(async (page = currentPage, search = searchTerm) => {
        setIsLoading(true);
        setError(null);
        try {
            let response: PaginatedRolesResponseModel;

            if (search) {
                response = await roleService.searchRoles(search, page);
            } else {
                response = await roleService.getPaginatedRoles(page);
            }

            if (response && response.data) {
                setRoles(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setRoles([]);
            }
        } catch (err) {
            console.error("Error al cargar roles:", err);
            const errorMessage = err instanceof Error ? err.message : "Error al cargar los roles";
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles(1, "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchRoles(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchRoles]);

    const handleAddRole = useCallback(() => {
        setSelectedRole(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditRole = useCallback((id?: number) => {
        if (id) {
            const role = roles.find(role => role.id === id);
            setSelectedRole(role);
            setIsModalOpen(true);
        }
    }, [roles]);

    const handleDeleteRole = useCallback((id?: number) => {
        if (id) {
            const role = roles.find(role => role.id === id);
            setRoleToDelete(role);
            setIsDeleteModalOpen(true);
        }
    }, [roles]);

    const handleConfirmDelete = useCallback(async () => {
        if (roleToDelete?.id) {
            setIsLoading(true);
            try {
                await roleService.deleteRole(roleToDelete.id);
                toast.success("Rol eliminado", {
                    description: "El rol ha sido eliminado correctamente"
                });
                fetchRoles(currentPage, searchTerm);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error al eliminar el rol";
                setError(errorMessage);
                toast.error("Error", {
                    description: errorMessage
                });
            } finally {
                setIsLoading(false);
                setIsDeleteModalOpen(false);
                setRoleToDelete(undefined);
            }
        }
    }, [roleToDelete, currentPage, searchTerm, fetchRoles]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setRoleToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedRole(undefined);
    }, []);

    const handleSubmitRole = useCallback(async (data: RoleModel) => {
        setIsLoading(true);
        try {
            if (data.id) {
                await roleService.updateRole(data.id, data);
                toast.success("Rol actualizado", {
                    description: "El rol ha sido actualizado correctamente"
                });
            } else {
                await roleService.createRole(data);
                toast.success("Rol creado", {
                    description: "El rol ha sido creado correctamente"
                });
            }
            fetchRoles(currentPage, searchTerm);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error al guardar el rol";
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    }, [currentPage, searchTerm, fetchRoles]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        roles,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedRole,
        isDeleteModalOpen,
        roleToDelete,
        isLoading,
        error,
        handleAddRole,
        handleEditRole,
        handleDeleteRole,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitRole,
        handleSearchChange,
        handlePageChange,
    };
};