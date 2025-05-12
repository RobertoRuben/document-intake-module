import { useState, useEffect } from "react";
import { settlementService } from "../service/settlement.service"; 
import { Settlement } from "../model/settlement.model";
import { toast } from "sonner";

/**
 * Hook to get all settlements
 * @returns {Object} Settlement data and loading state
 */
export const useSettlements = () => {
    const [data, setData] = useState<Settlement[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettlements = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const settlements = await settlementService.getAllSettlements();
                setData(settlements);
            } catch (err) {
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : "Error loading settlements";
                
                setError(errorMessage);
                toast.error(errorMessage);
                console.error("Error fetching settlements:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettlements();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const settlements = await settlementService.getAllSettlements();
                setData(settlements);
                setError(null);
                return settlements;
            } catch (err) {
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : "Error loading settlements";
                
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setIsLoading(false);
            }
        }
    };
};