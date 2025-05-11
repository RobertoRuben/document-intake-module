import React from "react";
import { SettlementHeader } from "@/modules/settlement/components/settlement-header/SettlementHeader";
import { SettlementTable } from "../settlement-table/SettlementTable";
import { SettlementTableProvider } from "@/modules/settlement/context/settlement-table.context";
import { useSettlementContext } from "@/modules/settlement/context/settlement.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { SettlementModal } from "@/modules/settlement/modals/SettlementModal";
import { Loader2 } from "lucide-react";

export const SettlementContainer: React.FC = () => {
    const {
        settlements,
        isLoading,
        handleAddSettlement,
        isModalOpen,
        selectedSettlement,
        handleCloseModal,
        handleSubmitSettlement,
        isDeleteModalOpen,
        settlementToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useSettlementContext();

    if (isLoading && settlements.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando asentamientos...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <SettlementHeader onAddClick={handleAddSettlement} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <SettlementTableProvider>
                    <SettlementTable />
                </SettlementTableProvider>
            </div>

            <SettlementModal
                isOpen={isModalOpen}
                settlement={selectedSettlement}
                onClose={handleCloseModal}
                onSubmit={handleSubmitSettlement}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Asentamiento"
                description={`¿Estás seguro de que deseas eliminar el asentamiento "${settlementToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};