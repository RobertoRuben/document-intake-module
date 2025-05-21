import React, { createContext, useContext, ReactNode } from "react";
import { useDepartmentConnectionsContainerHook } from "../hooks/use-department-connections-container.hook";

const DepartmentConnectionsContext = createContext<ReturnType<typeof useDepartmentConnectionsContainerHook> | undefined>(undefined);

export const DepartmentConnectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const departmentConnectionsState = useDepartmentConnectionsContainerHook();

    return (
        <DepartmentConnectionsContext.Provider value={departmentConnectionsState}>
            {children}
        </DepartmentConnectionsContext.Provider>
    );
};

export const useDepartmentConnectionsContext = () => {
    const context = useContext(DepartmentConnectionsContext);
    if (!context) {
        throw new Error("useDepartmentConnectionsContext debe usarse dentro de un DepartmentConnectionsProvider");
    }
    return context;
};