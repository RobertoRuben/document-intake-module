import React, { createContext, useContext, ReactNode } from "react";
import { useUserContainerHook } from "../hooks/use-user-container.hook";

const UserContext = createContext<ReturnType<typeof useUserContainerHook> | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userState = useUserContainerHook();

    return (
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext debe usarse dentro de un UserProvider");
    }
    return context;
};