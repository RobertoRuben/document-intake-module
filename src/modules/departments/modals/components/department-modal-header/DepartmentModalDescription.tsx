import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface DepartmentModalDescriptionProps {
    isEditing: boolean;
}

export const DepartmentModalDescription: React.FC<
    DepartmentModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del departamento en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo departamento."}
        </DialogDescription>
    );
};
