import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface SettlementModalDescriptionProps {
    isEditing: boolean;
}

export const SettlementModalDescription: React.FC<
    SettlementModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del asentamiento en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo asentamiento."}
        </DialogDescription>
    );
};