import React from "react";
import { UserHeader } from "@/modules/users/components/user-header/UserHeader";
import { UserTable } from "../user-table/UserTable";
import { UserTableProvider } from "@/modules/users/context/user-table.context";
import { useUserContext } from "@/modules/users/context/user.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { UserModal } from "@/modules/users/modals/UserModal";
import { Loader2 } from "lucide-react";

export const UserContainer: React.FC = () => {
    const {
        users,
        roles,
        employees,
        isLoading,
        handleAddUser,
        isModalOpen,
        selectedUser,
        handleCloseModal,
        handleSubmitUser,
        isDeleteModalOpen,
        userToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useUserContext();

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando usuarios...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <UserHeader onAddClick={handleAddUser} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <UserTableProvider>
                    <UserTable />
                </UserTableProvider>
            </div>

            <UserModal
                isOpen={isModalOpen}
                user={selectedUser}
                onClose={handleCloseModal}
                onSubmit={handleSubmitUser}
                roles={roles || []}
                employees={employees || []}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Usuario"
                description={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.username}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};