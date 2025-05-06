import React, { createContext, useContext, ReactNode } from "react";
import { useDepartmentContainerHook } from "../hooks/use-department-container.hook";

const DepartmentContext = createContext<ReturnType<typeof useDepartmentContainerHook> | undefined>(undefined);

export const DepartmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const departmentState = useDepartmentContainerHook();

    return (
        <DepartmentContext.Provider value={departmentState}>
            {children}
        </DepartmentContext.Provider>
    );
};

export const useDepartmentContext = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useDepartmentContext debe usarse dentro de un DepartmentProvider");
    }
    return context;
};