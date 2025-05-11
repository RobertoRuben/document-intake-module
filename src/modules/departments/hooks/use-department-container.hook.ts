import { useState, useEffect, useCallback, useRef } from "react";
import { departmentService} from "../services/department.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { Department } from "@/modules/departments/models/department.model";
import { PaginatedDepartmentsResponseModel } from "@/modules/departments/models/department.page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";


export const useDepartmentContainerHook = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
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
    const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | undefined>(undefined);
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: Department[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchDepartments = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDepartments(cachedData.data);
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
            let response: PaginatedDepartmentsResponseModel;

            if (search) {
                response = await departmentService.searchDepartments(search, page);
            } else {
                response = await departmentService.getPaginatedDepartments(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setDepartments(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setDepartments([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los departamentos";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setDepartments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchDepartments(1, "");
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
            setDepartments(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchDepartments(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchDepartments]);

    const handleAddDepartment = useCallback(() => {
        setSelectedDepartment(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditDepartment = useCallback((id?: number) => {
        if (id) {
            const department = departments.find(department => department.id === id);
            setSelectedDepartment(department);
            setIsModalOpen(true);
        }
    }, [departments]);

    const handleDeleteDepartment = useCallback((id?: number) => {
        if (id) {
            const department = departments.find(department => department.id === id);
            setDepartmentToDelete(department);
            setIsDeleteModalOpen(true);
        }
    }, [departments]);

    const handleConfirmDelete = useCallback(async () => {
        if (departmentToDelete?.id) {
            setIsLoading(true);
            
            try {
                await departmentService.deleteDepartment(departmentToDelete.id);
                toast.success("Departamento eliminado", {
                    description: "El departamento ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (departments.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchDepartments(previousPage, searchTerm, true);
                } else {
                    fetchDepartments(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el departamento";
                
                if (err instanceof AppOperationError) {
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
        }
    }, [departmentToDelete, currentPage, searchTerm, fetchDepartments, invalidateCache, departments.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setDepartmentToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedDepartment(undefined);
    }, []);

    const handleSubmitDepartment = useCallback(async (data: Department) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await departmentService.updateDepartment(data.id, data);
                toast.success("Departamento actualizado", {
                    description: "El departamento ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchDepartments(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await departmentService.createDepartment(data);
                toast.success("Departamento creado", {
                    description: "El departamento ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (departments.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchDepartments(newTotalPages, searchTerm, true);
                    } else {
                        fetchDepartments(currentPage, searchTerm, true);
                    }
                } else {
                    fetchDepartments(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el departamento";
            
            if (err instanceof AppOperationError) {
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
    }, [currentPage, searchTerm, fetchDepartments, invalidateCache, departments.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setDepartments(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm]);

    const handleDeleteMultipleDepartments = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await departmentService.deleteMultipleDepartments(ids);
            toast.success("Departamentos eliminados", {
                description: result.message || "Los departamentos han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= departments.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchDepartments(previousPage, searchTerm, true);
            } else {
                fetchDepartments(currentPage, searchTerm, true);
            }
            
            setSelectedDepartmentIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los departamentos";
            
            if (err instanceof AppOperationError) {
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
    }, [currentPage, searchTerm, fetchDepartments, invalidateCache, departments.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await departmentService.exportDepartmentsToExcel(ids);
            
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
                description: "Los departamentos han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los departamentos";
            
            if (err instanceof AppOperationError) {
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

    const handleSelectDepartments = useCallback((ids: number[]) => {
        setSelectedDepartmentIds(ids);
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
                                        const response = await departmentService.searchDepartments(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await departmentService.getPaginatedDepartments(page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    }
                                } catch (err) {
                                    if (err instanceof AppOperationError) {
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
        departments,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedDepartment,
        isDeleteModalOpen,
        departmentToDelete,
        selectedDepartmentIds,
        isLoading,
        error,
        handleAddDepartment,
        handleEditDepartment,
        handleDeleteDepartment,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitDepartment,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleDepartments,
        handleExportToExcel,
        handleSelectDepartments,
    };
};