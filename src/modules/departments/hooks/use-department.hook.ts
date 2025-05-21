import { useState, useEffect } from "react";
import { departmentService } from "../services/department.service";
import { Department } from "../models/department.model";
import { toast } from "sonner";

/**
 * Hook to get all departments
 * @returns {Object} Department data and loading state
 */
export const useDepartments = () => {
    const [data, setData] = useState<Department[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const departments = await departmentService.getAllDepartments();
                setData(departments);
            } catch (err) {
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : "Error loading departments";
                
                setError(errorMessage);
                toast.error(errorMessage);
                console.error("Error fetching departments:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch: async () => {
            setIsLoading(true);
            try {
                const departments = await departmentService.getAllDepartments();
                setData(departments);
                setError(null);
                return departments;
            } catch (err) {
                const errorMessage = err instanceof Error 
                    ? err.message 
                    : "Error loading departments";
                
                setError(errorMessage);
                toast.error(errorMessage);
                throw err;
            } finally {
                setIsLoading(false);
            }
        }
    };
};