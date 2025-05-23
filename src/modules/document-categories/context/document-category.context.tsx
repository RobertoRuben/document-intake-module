import React, { createContext, useContext, ReactNode } from "react";
import { useDocumentCategoriesContainer } from "../hooks/use-document-categories-container.hook";

const DocumentCategoryContext = createContext<ReturnType<typeof useDocumentCategoriesContainer> | undefined>(undefined);

export const DocumentCategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const documentCategoryState = useDocumentCategoriesContainer();

    return (
        <DocumentCategoryContext.Provider value={documentCategoryState}>
            {children}
        </DocumentCategoryContext.Provider>
    );
};

export const useDocumentCategoryContext = () => {
    const context = useContext(DocumentCategoryContext);
    if (!context) {
        throw new Error("useDocumentCategoryContext debe usarse dentro de un DocumentCategoryProvider");
    }
    return context;
};