import { useState, useEffect, useCallback, useRef } from "react";
import { hamletService } from "../service/hamlet.service";
import { settlementService } from "@/modules/settlements/service/settlement.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { Hamlet } from "../model/hamlet.model";
import { Settlement } from "@/modules/settlements/model/settlement.model";
import { PaginatedHamletsResponseModel } from "../model/hamlet-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useHamletContainerHook = () => {
    const [hamlets, setHamlets] = useState<Hamlet[]>([]);
    const [settlements, setSettlements] = useState<Settlement[]>([]);
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
    const [selectedHamlet, setSelectedHamlet] = useState<Hamlet | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [hamletToDelete, setHamletToDelete] = useState<Hamlet | undefined>(undefined);
    const [selectedHamletIds, setSelectedHamletIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: Hamlet[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchHamlets = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setHamlets(cachedData.data);
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
            let response: PaginatedHamletsResponseModel;

            if (search) {
                response = await hamletService.searchHamlets(search, page);
            } else {
                response = await hamletService.getPaginatedHamlets(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setHamlets(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setHamlets([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los caseríos";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setHamlets([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, CACHE_VALIDITY_TIME]);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    const fetchSettlements = useCallback(async () => {
        try {
            const settlementsData = await settlementService.getAllSettlements();
            setSettlements(settlementsData);
        } catch (err) {
            let errorMessage = "Error al cargar los asentamientos";
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            toast.error("Error", {
                description: errorMessage,
            });
        }
    }, []);

    useEffect(() => {
        fetchHamlets(1, "");
        fetchSettlements();
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
            setHamlets(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchHamlets(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchHamlets, CACHE_VALIDITY_TIME]);

    const handleAddHamlet = useCallback(() => {
        setSelectedHamlet(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditHamlet = useCallback((id?: number) => {
        if (id) {
            const hamlet = hamlets.find(hamlet => hamlet.id === id);
            setSelectedHamlet(hamlet);
            setIsModalOpen(true);
        }
    }, [hamlets]);

    const handleDeleteHamlet = useCallback((id?: number) => {
        if (id) {
            const hamlet = hamlets.find(hamlet => hamlet.id === id);
            setHamletToDelete(hamlet);
            setIsDeleteModalOpen(true);
        }
    }, [hamlets]);

    const handleConfirmDelete = useCallback(async () => {
        if (hamletToDelete?.id) {
            setIsLoading(true);
            
            try {
                await hamletService.deleteHamlet(hamletToDelete.id);
                toast.success("Caserío eliminado", {
                    description: "El caserío ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (hamlets.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchHamlets(previousPage, searchTerm, true);
                } else {
                    fetchHamlets(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el caserío";
                
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
    }, [hamletToDelete, currentPage, searchTerm, fetchHamlets, invalidateCache, hamlets.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setHamletToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedHamlet(undefined);
    }, []);

    const handleSubmitHamlet = useCallback(async (data: Hamlet) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await hamletService.updateHamlet(data.id, data);
                toast.success("Caserío actualizado", {
                    description: "El caserío ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchHamlets(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await hamletService.createHamlet(data);
                toast.success("Caserío creado", {
                    description: "El caserío ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (hamlets.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchHamlets(newTotalPages, searchTerm, true);
                    } else {
                        fetchHamlets(currentPage, searchTerm, true);
                    }
                } else {
                    fetchHamlets(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el caserío";
            
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
    }, [currentPage, searchTerm, fetchHamlets, invalidateCache, hamlets.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setHamlets(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm, CACHE_VALIDITY_TIME]);

    const handleDeleteMultipleHamlets = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await hamletService.deleteMultipleHamlets(ids);
            toast.success("Caseríos eliminados", {
                description: result.message || "Los caseríos han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= hamlets.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchHamlets(previousPage, searchTerm, true);
            } else {
                fetchHamlets(currentPage, searchTerm, true);
            }
            
            setSelectedHamletIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los caseríos";
            
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
    }, [currentPage, searchTerm, fetchHamlets, invalidateCache, hamlets.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await hamletService.exportHamletsToExcel(ids);
            
            const url = window.URL.createObjectURL(excelBlob);
            const link = document.createElement('a');
            link.href = url;
            
            const date = new Date();
            const fileName = `caserios_${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Exportación completada", {
                description: "Los caseríos han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los caseríos";
            
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

    const handleSelectHamlets = useCallback((ids: number[]) => {
        setSelectedHamletIds(ids);
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup if needed
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
                                        const response = await hamletService.searchHamlets(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await hamletService.getPaginatedHamlets(page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    }
                                } catch {
                                    // Error silencioso - no interrumpe la experiencia del usuario
                                }
                            })();
                        }
                    });
                }, 1000); 
                
                return () => {
                    clearTimeout(preloadTimer);
                };
            }
        }
    }, [paginationMeta, searchTerm]);

    return {
        hamlets,
        settlements,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedHamlet,
        isDeleteModalOpen,
        hamletToDelete,
        selectedHamletIds,
        isLoading,
        error,
        handleAddHamlet,
        handleEditHamlet,
        handleDeleteHamlet,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitHamlet,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleHamlets,
        handleExportToExcel,
        handleSelectHamlets,
    };
};