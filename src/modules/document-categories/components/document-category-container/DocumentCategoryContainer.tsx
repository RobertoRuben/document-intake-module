import React from "react";
import { DocumentHeader } from "@/modules/document-categories/components/document-category-header/DocumentHeader";
import { DocumentCategoryTable } from "../document-category-table/DocumentCategoryTable";
import { DocumentCategoryTableProvider } from "@/modules/document-categories/context/document-category-table.context";
import { useDocumentCategoryContext } from "@/modules/document-categories/context/document-category.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { DocumentCategoryModal } from "@/modules/document-categories/modals/DocumentCategoryModal";
import { Loader2 } from "lucide-react";

export const DocumentCategoryContainer: React.FC = () => {
    const {
        documentCategories,
        isLoading,
        handleAddCategory,
        isModalOpen,
        selectedCategory,
        handleCloseModal,
        handleSubmitCategory,
        isDeleteModalOpen,
        categoryToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useDocumentCategoryContext();

    if (isLoading && documentCategories.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando categorías...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <DocumentHeader onAddClick={handleAddCategory} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <DocumentCategoryTableProvider>
                    <DocumentCategoryTable />
                </DocumentCategoryTableProvider>
            </div>

            <DocumentCategoryModal
                isOpen={isModalOpen}
                documentCategory={selectedCategory}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCategory}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Categoría"
                description={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};