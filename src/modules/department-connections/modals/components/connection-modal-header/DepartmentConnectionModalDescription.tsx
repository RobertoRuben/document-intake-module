import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface DepartmentConnectionModalDescriptionProps {
    isEditing: boolean;
}

export const DepartmentConnectionModalDescription: React.FC<
    DepartmentConnectionModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos de la conexión entre departamentos en el formulario a continuación."
                : "Complete el formulario para registrar una nueva conexión entre departamentos."}
        </DialogDescription>
    );
};