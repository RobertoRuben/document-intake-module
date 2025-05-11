import { useState, useEffect, useCallback, useRef } from "react";
import { settlementService } from "../service/settlement.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { Settlement } from "../model/settlement.model";
import { PaginatedSettlementsResponseModel } from "../model/settlement-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";

export const useSettlementContainerHook = () => {
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
    const [selectedSettlement, setSelectedSettlement] = useState<Settlement | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [settlementToDelete, setSettlementToDelete] = useState<Settlement | undefined>(undefined);
    const [selectedSettlementIds, setSelectedSettlementIds] = useState<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const lastFetchParamsRef = useRef<{page: number, search: string} | null>(null);
    
    const pagesCache = useRef<Record<string, {
        data: Settlement[],
        meta: PaginationMetaModel,
        timestamp: number
    }>>({});
    
    const CACHE_VALIDITY_TIME = 5 * 60 * 1000;

    const fetchSettlements = useCallback(async (page = currentPage, search = searchTerm, forceRefresh = false) => {
        const cacheKey = `${page}:${search}`;
        
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (!forceRefresh && cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setSettlements(cachedData.data);
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
            let response: PaginatedSettlementsResponseModel;

            if (search) {
                response = await settlementService.searchSettlements(search, page);
            } else {
                response = await settlementService.getPaginatedSettlements(page);
            }

            if (response && response.data) {
                pagesCache.current[cacheKey] = {
                    data: response.data,
                    meta: response.meta,
                    timestamp: now
                };
                
                setSettlements(response.data);

                if (response.meta) {
                    setPaginationMeta(response.meta);
                }

                setDataVersion(prev => prev + 1);
            } else {
                setSettlements([]);
            }
        } catch (err) {
            let errorMessage = "Error al cargar los asentamientos";
            
            if (err instanceof AppOperationError) {
                errorMessage = err.details || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
            setSettlements([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const invalidateCache = useCallback(() => {
        pagesCache.current = {};
    }, []);

    useEffect(() => {
        fetchSettlements(1, "");
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
            setSettlements(cachedData.data);
            setPaginationMeta(cachedData.meta);
        }

        fetchTimeoutRef.current = setTimeout(() => {
            fetchSettlements(currentPage, searchTerm);
        }, 300);

        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [currentPage, searchTerm, fetchSettlements]);

    const handleAddSettlement = useCallback(() => {
        setSelectedSettlement(undefined);
        setIsModalOpen(true);
    }, []);

    const handleEditSettlement = useCallback((id?: number) => {
        if (id) {
            const settlement = settlements.find(settlement => settlement.id === id);
            setSelectedSettlement(settlement);
            setIsModalOpen(true);
        }
    }, [settlements]);

    const handleDeleteSettlement = useCallback((id?: number) => {
        if (id) {
            const settlement = settlements.find(settlement => settlement.id === id);
            setSettlementToDelete(settlement);
            setIsDeleteModalOpen(true);
        }
    }, [settlements]);

    const handleConfirmDelete = useCallback(async () => {
        if (settlementToDelete?.id) {
            setIsLoading(true);
            
            try {
                await settlementService.deleteSettlement(settlementToDelete.id);
                toast.success("Asentamiento eliminado", {
                    description: "El asentamiento ha sido eliminado correctamente"
                });
                
                invalidateCache();
                
                if (settlements.length === 1 && currentPage > 1) {
                    const previousPage = currentPage - 1;
                    setCurrentPage(previousPage);
                    fetchSettlements(previousPage, searchTerm, true);
                } else {
                    fetchSettlements(currentPage, searchTerm, true);
                }
                setIsDeleteModalOpen(false);
            } catch (err) {
                let errorMessage = "Error al eliminar el asentamiento";
                
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
    }, [settlementToDelete, currentPage, searchTerm, fetchSettlements, invalidateCache, settlements.length]);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setSettlementToDelete(undefined);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedSettlement(undefined);
    }, []);

    const handleSubmitSettlement = useCallback(async (data: Settlement) => {
        setIsLoading(true);
        
        try {
            if (data.id) {
                await settlementService.updateSettlement(data.id, data);
                toast.success("Asentamiento actualizado", {
                    description: "El asentamiento ha sido actualizado correctamente"
                });
                invalidateCache();
                fetchSettlements(currentPage, searchTerm, true);
                setIsModalOpen(false);
                return true;
            } else {
                await settlementService.createSettlement(data);
                toast.success("Asentamiento creado", {
                    description: "El asentamiento ha sido creado correctamente"
                });
                
                invalidateCache();
                
                if (settlements.length >= paginationMeta.perPage) {
                    const newTotalItems = paginationMeta.total + 1;
                    const newTotalPages = Math.ceil(newTotalItems / paginationMeta.perPage);
                    
                    if (newTotalPages > paginationMeta.totalPages) {
                        setCurrentPage(newTotalPages);
                        fetchSettlements(newTotalPages, searchTerm, true);
                    } else {
                        fetchSettlements(currentPage, searchTerm, true);
                    }
                } else {
                    fetchSettlements(currentPage, searchTerm, true);
                }
                
                setIsModalOpen(false);
                return true;
            }
        } catch (err) {
            let errorMessage = "Error al guardar el asentamiento";
            
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
    }, [currentPage, searchTerm, fetchSettlements, invalidateCache, settlements.length, paginationMeta]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); 
    }, []);

    const handlePageChange = useCallback((page: number) => {
        const cacheKey = `${page}:${searchTerm}`;
        const cachedData = pagesCache.current[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp < CACHE_VALIDITY_TIME)) {
            setSettlements(cachedData.data);
            setPaginationMeta(prev => ({
                ...prev,
                currentPage: page
            }));
        }
        
        setCurrentPage(page);
    }, [searchTerm]);

    const handleDeleteMultipleSettlements = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const result = await settlementService.deleteMultipleSettlements(ids);
            toast.success("Asentamientos eliminados", {
                description: result.message || "Los asentamientos han sido eliminados correctamente"
            });
            
            invalidateCache();
            
            const allItemsDeleted = ids.length >= settlements.length;
            
            if (allItemsDeleted && currentPage > 1) {
                const previousPage = currentPage - 1;
                setCurrentPage(previousPage);
                fetchSettlements(previousPage, searchTerm, true);
            } else {
                fetchSettlements(currentPage, searchTerm, true);
            }
            
            setSelectedSettlementIds([]);
        } catch (err) {
            let errorMessage = "Error al eliminar los asentamientos";
            
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
    }, [currentPage, searchTerm, fetchSettlements, invalidateCache, settlements.length]);

    const handleExportToExcel = useCallback(async (ids: number[]) => {
        if (ids.length === 0) return;
        
        setIsLoading(true);
        
        try {
            const excelBlob = await settlementService.exportSettlementsToExcel(ids);
            
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
                description: "Los asentamientos han sido exportados a Excel correctamente"
            });
        } catch (err) {
            let errorMessage = "Error al exportar los asentamientos";
            
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

    const handleSelectSettlements = useCallback((ids: number[]) => {
        setSelectedSettlementIds(ids);
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
                                        const response = await settlementService.searchSettlements(searchTerm, page);
                                        pagesCache.current[cacheKey] = {
                                            data: response.data,
                                            meta: response.meta,
                                            timestamp: Date.now()
                                        };
                                    } else {
                                        const response = await settlementService.getPaginatedSettlements(page);
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
        settlements,
        paginationMeta,
        dataVersion,
        currentPage,
        searchTerm,
        isModalOpen,
        selectedSettlement,
        isDeleteModalOpen,
        settlementToDelete,
        selectedSettlementIds,
        isLoading,
        error,
        handleAddSettlement,
        handleEditSettlement,
        handleDeleteSettlement,
        handleConfirmDelete,
        handleCancelDelete,
        handleCloseModal,
        handleSubmitSettlement,
        handleSearchChange,
        handlePageChange,
        handleDeleteMultipleSettlements,
        handleExportToExcel,
        handleSelectSettlements,
    };
};