import React from "react";
import { PositionHeader } from "@/modules/positions/components/position-header/PositionHeader";
import { PositionTable } from "../position-table/PositionTable";
import { PositionTableProvider } from "@/modules/positions/context/position-table.context";
import { usePositionContext } from "@/modules/positions/context/position.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { PositionModal } from "@/modules/positions/modals/PositionModal";
import { Loader2 } from "lucide-react";

export const PositionContainer: React.FC = () => {
    const {
        positions,
        isLoading,
        handleAddPosition,
        isModalOpen,
        selectedPosition,
        handleCloseModal,
        handleSubmitPosition,
        isDeleteModalOpen,
        positionToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = usePositionContext();

    if (isLoading && positions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando cargos...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <PositionHeader onAddClick={handleAddPosition} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <PositionTableProvider>
                    <PositionTable />
                </PositionTableProvider>
            </div>

            <PositionModal
                isOpen={isModalOpen}
                position={selectedPosition}
                onClose={handleCloseModal}
                onSubmit={handleSubmitPosition}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Cargo"
                description={`¿Estás seguro de que deseas eliminar el cargo "${positionToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};