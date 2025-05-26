import React from "react";
import { DocumentaryTopicHeader } from "@/modules/documentary-topic/components/documentary-topic-header/DocumentaryTopicHeader";
import { DocumentaryTopicTable } from "../documentary-topic-table/DocumentaryTopicTable";
import { DocumentaryTopicTableProvider } from "@/modules/documentary-topic/context/documentary-topic-table.context";
import { useDocumentaryTopicContext } from "@/modules/documentary-topic/context/documentary-topic.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { DocumentaryTopicModal } from "@/modules/documentary-topic/modals/DocumentaryTopicModal";
import { Loader2 } from "lucide-react";

export const DocumentaryTopicContainer: React.FC = () => {
    const {
        documentaryTopics,
        isLoading,
        handleAddTopic,
        isModalOpen,
        selectedTopic,
        handleCloseModal,
        handleSubmitTopic,
        isDeleteModalOpen,
        topicToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useDocumentaryTopicContext();

    if (isLoading && documentaryTopics.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando temas documentales...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <DocumentaryTopicHeader onAddClick={handleAddTopic} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <DocumentaryTopicTableProvider>
                    <DocumentaryTopicTable />
                </DocumentaryTopicTableProvider>
            </div>

            <DocumentaryTopicModal
                isOpen={isModalOpen}
                documentaryTopic={selectedTopic}
                onClose={handleCloseModal}
                onSubmit={handleSubmitTopic}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Tema Documental"
                description={`¿Estás seguro de que deseas eliminar el tema "${topicToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};