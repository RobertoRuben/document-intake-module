import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface RoleModalDescriptionProps {
    isEditing: boolean;
}

export const RoleModalDescription: React.FC<RoleModalDescriptionProps> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del rol en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo rol."}
        </DialogDescription>
    );
};