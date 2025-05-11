import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface UserModalDescriptionProps {
    isEditing: boolean;
}

export const UserModalDescription: React.FC<
    UserModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del usuario en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo usuario."}
        </DialogDescription>
    );
};