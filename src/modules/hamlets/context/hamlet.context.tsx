import React, { createContext, useContext, ReactNode } from "react";
import { useHamletContainerHook } from "../hooks/use-hamlet-container.hook";

const HamletContext = createContext<ReturnType<typeof useHamletContainerHook> | undefined>(undefined);

export const HamletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const hamletState = useHamletContainerHook();

    return (
        <HamletContext.Provider value={hamletState}>
            {children}
        </HamletContext.Provider>
    );
};

export const useHamletContext = () => {
    const context = useContext(HamletContext);
    if (!context) {
        throw new Error("useHamletContext debe usarse dentro de un HamletProvider");
    }
    return context;
};