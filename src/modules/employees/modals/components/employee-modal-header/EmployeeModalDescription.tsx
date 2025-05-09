import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface EmployeeModalDescriptionProps {
    isEditing: boolean;
}

export const EmployeeModalDescription: React.FC<
    EmployeeModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del empleado en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo empleado."}
        </DialogDescription>
    );
};