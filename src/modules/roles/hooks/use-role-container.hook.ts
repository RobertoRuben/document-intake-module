import { useState, useEffect, useCallback, useRef } from "react";
import { roleService, RoleOperationError } from "@/modules/roles/service/role.service";
import { RoleModel } from "@/modules/roles/models/role.model";
import { PaginatedRolesResponseModel } from "@/modules/roles/models/role.page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";


export const useRoleContainerHook = () => {
    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMetaModel>({
        currentPage: 1,
        perPage: 5,
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
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: RoleModel[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchRoles = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setRoles(cachedData.data);
            setPaginationMeta(cachedData.meta);
            setIsLoading(false);
            return;
        }
        
        const fetchParams = { page, search };
        if (!forceRefresh && lastFetchParamsRef.current && 
            lastFetchParamsRef.current.page === page && 
            lastFetchParamsRef.current.search === search) {
            return;
        }
        
        lastFetchParamsRef.current = fetchParams;
        
        
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
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setRoles(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setRoles([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los roles";
            
            if (err instanceof RoleOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchRoles(1, "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }

        const cacheKey = `${currentPage}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setRoles(cachedData.data);
            setPaginationMeta(cachedData.meta);
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
                
                invalidateCache();
                fetchRoles(currentPage, searchTerm, true);
            } catch (err) {
                let errorMessage = "Error al eliminar el rol";
                
                if (err instanceof RoleOperationError) {
                    errorMessage = err.details || err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                
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
    }, [roleToDelete, currentPage, searchTerm, fetchRoles, invalidateCache]);

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
                invalidateCache();
                fetchRoles(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await roleService.createRole(data);
                toast.success("Rol creado", {
                    description: "El rol ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (roles.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchRoles(newTotalPages, searchTerm, true);
                    } else {
                        fetchRoles(currentPage, searchTerm, true);
                    }
                } else {
                    fetchRoles(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el rol";
            
            if (err instanceof RoleOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
            setIsLoading(false);
            return false;
        }
    }, [currentPage, searchTerm, fetchRoles, invalidateCache, roles.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setRoles(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm]);

    const handleDeleteMultipleRoles = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await roleService.deleteMultipleRoles(ids);
            toast.success("Roles eliminados", {
                description: result.message || "Los roles han sido eliminados correctamente"
            });
            
            invalidateCache();
            fetchRoles(currentPage, searchTerm, true);
            setSelectedRoleIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los roles";
            
            if (err instanceof RoleOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, fetchRoles, invalidateCache]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await roleService.exportRolesToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Los roles han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los roles";
            
            if (err instanceof RoleOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectRoles = useCallback((ids: number[]) => {
        setSelectedRoleIds(ids);
    }, []);

    useEffect(() => {
        return () => {
        };
    }, [dataVersion]);

    useEffect(() => {
        if (paginationMeta && paginationMeta.totalPages > 1) {
            const pagesToPreload: number[] = [];
        
            if (paginationMeta.nextPage) {
                pagesToPreload.push(paginationMeta.nextPage);
            }
            
            if (pagesToPreload.length > 0) {
                const preloadTimer = setTimeout(() => {
                    pagesToPreload.forEach(page => {
                        const cacheKey = `${page}:${searchTerm}`;
                        if (!pagesCache.current[cacheKey]) {
                            (async () => {
                                try {
                                    if (searchTerm) {
                                        const response = await roleService.searchRoles(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await roleService.getPaginatedRoles(page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    }
                                } catch (err) {
                                    if (err instanceof RoleOperationError) {
                                        console.log(`Error en precarga: ${err.details || err.message}`);
                                    } else {
                                        console.log(`Error en precarga: `, err);
                                    }
                                }
                            })();
                        }
                    });
                }, 1000); 
                
                return () => clearTimeout(preloadTimer);
            }
        }
    }, [paginationMeta, searchTerm]);

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
        selectedRoleIds,
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
        handleDeleteMultipleRoles,
        handleExportToExcel,
        handleSelectRoles,
    };
};