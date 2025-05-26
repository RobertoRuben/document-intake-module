import React, { createContext, useContext, ReactNode } from "react";
import { useDocumentaryTopicContainer } from "../hook/use-documentary-topic-container.hook";

const DocumentaryTopicContext = createContext<ReturnType<typeof useDocumentaryTopicContainer> | undefined>(undefined);

export const DocumentaryTopicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const documentaryTopicState = useDocumentaryTopicContainer();

    return (
        <DocumentaryTopicContext.Provider value={documentaryTopicState}>
            {children}
        </DocumentaryTopicContext.Provider>
    );
};

export const useDocumentaryTopicContext = () => {
    const context = useContext(DocumentaryTopicContext);
    if (!context) {
        throw new Error("useDocumentaryTopicContext debe usarse dentro de un DocumentaryTopicProvider");
    }
    return context;
};