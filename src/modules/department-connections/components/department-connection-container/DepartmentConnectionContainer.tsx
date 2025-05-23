import React from "react";
import { DepartmentConnectionHeader } from "@/modules/department-connections/components/department-connection-header/DepartmentConnectionHeader";
import { DepartmentConnectionTable } from "../department-connection-table/DepartmentConnectionTable";
import { DepartmentConnectionTableProvider } from "@/modules/department-connections/context/department-connection-table.context";
import { useDepartmentConnectionsContext } from "@/modules/department-connections/context/department-connections.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { DepartmentConnectionModal } from "@/modules/department-connections/modals/DepartmentConnectionModal";
import { Loader2 } from "lucide-react";

export const DepartmentConnectionContainer: React.FC = () => {
    const {
        departmentConnections,
        departments,
        isLoading,
        handleAddDepartmentConnection,
        isModalOpen,
        selectedDepartmentConnection,
        handleCloseModal,
        handleSubmitDepartmentConnection,
        isDeleteModalOpen,
        departmentConnectionToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useDepartmentConnectionsContext();

    if (isLoading && departmentConnections.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando conexiones de departamentos...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <DepartmentConnectionHeader onAddClick={handleAddDepartmentConnection} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <DepartmentConnectionTableProvider>
                    <DepartmentConnectionTable />
                </DepartmentConnectionTableProvider>
            </div>

            <DepartmentConnectionModal
                isOpen={isModalOpen}
                departmentConnection={selectedDepartmentConnection}
                onClose={handleCloseModal}
                onSubmit={handleSubmitDepartmentConnection}
                departments={departments || []}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Conexión"
                description={`¿Estás seguro de que deseas eliminar la conexión entre "${departmentConnectionToDelete?.sourceDepartmentName}" y "${departmentConnectionToDelete?.targetDepartmentName}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};