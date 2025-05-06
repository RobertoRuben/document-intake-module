import React from "react";
import { DepartmentHeader } from "@/modules/departments/components/department-header/DepartmentHeader";
import { DepartmentTable } from "../department-table/DepartmentTable";
import { DepartmentTableProvider } from "@/modules/departments/context/department-table.context";
import { useDepartmentContext } from "@/modules/departments/context/department.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { DepartmentModal } from "@/modules/departments/modals/DepartmentModal";
import { Loader2 } from "lucide-react";

export const DepartmentContainer: React.FC = () => {
    const {
        departments,
        isLoading,
        handleAddDepartment,
        isModalOpen,
        selectedDepartment,
        handleCloseModal,
        handleSubmitDepartment,
        isDeleteModalOpen,
        departmentToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useDepartmentContext();

    if (isLoading && departments.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando departamentos...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <DepartmentHeader onAddClick={handleAddDepartment} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <DepartmentTableProvider>
                    <DepartmentTable />
                </DepartmentTableProvider>
            </div>

            <DepartmentModal
                isOpen={isModalOpen}
                department={selectedDepartment}
                onClose={handleCloseModal}
                onSubmit={handleSubmitDepartment}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Departamento"
                description={`¿Estás seguro de que deseas eliminar el departamento "${departmentToDelete?.name}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};