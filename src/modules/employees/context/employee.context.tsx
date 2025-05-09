import React, { createContext, useContext, ReactNode } from "react";
import { useEmployeeContainerHook } from "../hooks/use-employee-container.hook";

const EmployeeContext = createContext<ReturnType<typeof useEmployeeContainerHook> | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const employeeState = useEmployeeContainerHook();

    return (
        <EmployeeContext.Provider value={employeeState}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployeeContext = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployeeContext debe usarse dentro de un EmployeeProvider");
    }
    return context;
};