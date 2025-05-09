import React from "react";
import { EmployeeHeader } from "@/modules/employees/components/employee-header/EmployeeHeader";
import { EmployeeTable } from "../employee-table/EmployeeTable";
import { EmployeeTableProvider } from "@/modules/employees/context/employee-table.context";
import { useEmployeeContext } from "@/modules/employees/context/employee.context";
import { DeleteModal } from "@/globals/modals/delete-modal/DeleteModal";
import { EmployeeModal } from "@/modules/employees/modals/EmployeeModal";
import { Loader2 } from "lucide-react";

export const EmployeeContainer: React.FC = () => {
    const {
        employees,
        positions,
        departments,
        isLoading,
        handleAddEmployee,
        isModalOpen,
        selectedEmployee,
        handleCloseModal,
        handleSubmitEmployee,
        isDeleteModalOpen,
        employeeToDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useEmployeeContext();

    if (isLoading && employees.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#145A32]" />
                <span className="ml-2 text-gray-600">Cargando empleados...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <EmployeeHeader onAddClick={handleAddEmployee} />

            <div className="bg-white rounded-lg shadow-md p-6">
                <EmployeeTableProvider>
                    <EmployeeTable />
                </EmployeeTableProvider>
            </div>

            <EmployeeModal
                isOpen={isModalOpen}
                employee={selectedEmployee}
                onClose={handleCloseModal}
                onSubmit={handleSubmitEmployee}
                positions={positions || []}
                departments={departments || []}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Empleado"
                description={`¿Estás seguro de que deseas eliminar al empleado "${employeeToDelete?.names} ${employeeToDelete?.paternalSurname}"? Esta acción no se puede deshacer.`}
                isLoading={isLoading}
            />
        </div>
    );
};