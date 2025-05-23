import React from "react";
import { DocumentaryTopicHeaderTitle } from "@/modules/documentary-topic/components/documentary-topic-header/DocumentaryTopicHeaderTitle";
import { AddButton } from "@/globals/components/AddButton";

interface DocumentaryTopicTableHeaderProps {
    onAddClick: () => void;
}

export const DocumentaryTopicTableHeader: React.FC<DocumentaryTopicTableHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 mt-4 bg-transparent">
            <DocumentaryTopicHeaderTitle />
            <AddButton 
                onClick={onAddClick} 
                label="Agregar Tema"
            />
        </div>
    )
}