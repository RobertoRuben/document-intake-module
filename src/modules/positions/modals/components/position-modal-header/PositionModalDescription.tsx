import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface PositionModalDescriptionProps {
    isEditing: boolean;
}

export const PositionModalDescription: React.FC<
    PositionModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del cargo en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo cargo."}
        </DialogDescription>
    );
};