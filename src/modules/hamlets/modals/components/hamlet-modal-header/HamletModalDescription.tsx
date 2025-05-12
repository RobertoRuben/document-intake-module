import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface HamletModalDescriptionProps {
    isEditing: boolean;
}

export const HamletModalDescription: React.FC<
    HamletModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del caserío en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo caserío."}
        </DialogDescription>
    );
};