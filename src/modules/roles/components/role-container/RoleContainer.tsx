import React from "react";
import { RoleHeader } from "@/modules/roles/components/role-header/RoleHeader";
import { RoleTable } from "@/modules/roles/components/role-table/RoleTable";
import { RoleTableProvider } from "@/modules/roles/context/role-table.context";
import { useRoleContext } from "@/modules/roles/context/role.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { RoleModal } from "@/modules/roles/modals/RoleModal";
import { Loader2 } from "lucide-react";

export const RoleContainer: React.FC = () => {
    const {
        roles,
        isLoading,
        handleAddRole,
        isModalOpen,
        selectedRole,
        handleCloseModal,
        handleSubmitRole,
        isDeleteModalOpen,
        roleToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useRoleContext();

    if (isLoading && roles.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando roles...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <RoleHeader onAddClick={handleAddRole} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <RoleTableProvider>
                    <RoleTable />
                </RoleTableProvider>
            </div>

            <RoleModal
                isOpen={isModalOpen}
                role={selectedRole}
                onClose={handleCloseModal}
                onSubmit={handleSubmitRole}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Rol"
                description={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};