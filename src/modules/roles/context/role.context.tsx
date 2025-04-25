import React, { createContext, useContext, ReactNode } from "react";
import { useRoleContainerHook } from "../hooks/use-role-container.hook";

const RoleContext = createContext<ReturnType<typeof useRoleContainerHook> | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const roleState = useRoleContainerHook();

    return (
        <RoleContext.Provider value={roleState}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRoleContext = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRoleContext debe usarse dentro de un RoleProvider");
    }
    return context;
};