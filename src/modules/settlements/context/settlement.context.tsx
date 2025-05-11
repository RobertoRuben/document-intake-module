import React, { createContext, useContext, ReactNode } from "react";
import { useSettlementContainerHook } from "../hooks/use-settlement-container.hook";

const SettlementContext = createContext<ReturnType<typeof useSettlementContainerHook> | undefined>(undefined);

export const SettlementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const settlementState = useSettlementContainerHook();

    return (
        <SettlementContext.Provider value={settlementState}>
            {children}
        </SettlementContext.Provider>
    );
};

export const useSettlementContext = () => {
    const context = useContext(SettlementContext);
    if (!context) {
        throw new Error("useSettlementContext debe usarse dentro de un SettlementProvider");
    }
    return context;
};