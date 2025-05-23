import React from "react";
import { DocumentHeaderTitle } from "@/modules/document-categories/components/document-category-header/DocumentHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface DocumentHeaderProps {
    onAddClick: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <DocumentHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Categoría"
            />
        </div>
    )
}