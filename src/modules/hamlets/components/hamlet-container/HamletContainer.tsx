import React from "react";
import { HamletHeader } from "@/modules/hamlets/components/hamlet-header/HamletHeader";
import { HamletTable } from "../hamlet-table/HamletTable";
import { HamletTableProvider } from "@/modules/hamlets/context/hamlet-table.context";
import { useHamletContext } from "@/modules/hamlets/context/hamlet.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { HamletModal } from "@/modules/hamlets/modals/HamletModal";
import { Loader2 } from "lucide-react";

export const HamletContainer: React.FC = () => {
    const {
        hamlets,
        settlements,
        isLoading,
        handleAddHamlet,
        isModalOpen,
        selectedHamlet,
        handleCloseModal,
        handleSubmitHamlet,
        isDeleteModalOpen,
        hamletToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useHamletContext();

    if (isLoading && hamlets.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando caseríos...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <HamletHeader onAddClick={handleAddHamlet} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <HamletTableProvider>
                    <HamletTable />
                </HamletTableProvider>
            </div>

            <HamletModal
                isOpen={isModalOpen}
                hamlet={selectedHamlet}
                onClose={handleCloseModal}
                onSubmit={handleSubmitHamlet}
                settlements={settlements || []}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Caserío"
                description={`¿Estás seguro de que deseas eliminar el caserío "${hamletToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};