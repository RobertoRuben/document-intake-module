import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface DocumentaryTopicModalDescriptionProps {
    isEditing: boolean;
}

export const DocumentaryTopicModalDescription: React.FC<
    DocumentaryTopicModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos del tema documental en el formulario a continuación."
                : "Complete el formulario para registrar un nuevo tema documental."}
        </DialogDescription>
    );
};