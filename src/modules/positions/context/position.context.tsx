import React, { createContext, useContext, ReactNode } from "react";
import { usePositionContainerHook } from "../hooks/use-position-container.hook";

const PositionContext = createContext<ReturnType<typeof usePositionContainerHook> | undefined>(undefined);

export const PositionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const positionState = usePositionContainerHook();

    return (
        <PositionContext.Provider value={positionState}>
            {children}
        </PositionContext.Provider>
    );
};

export const usePositionContext = () => {
    const context = useContext(PositionContext);
    if (!context) {
        throw new Error("usePositionContext debe usarse dentro de un PositionProvider");
    }
    return context;
};