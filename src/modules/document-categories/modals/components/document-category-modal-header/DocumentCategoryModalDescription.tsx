import { DialogDescription } from "@/modules/core/components/ui/dialog";

interface DocumentCategoryModalDescriptionProps {
    isEditing: boolean;
}

export const DocumentCategoryModalDescription: React.FC<
    DocumentCategoryModalDescriptionProps
> = ({ isEditing }) => {
    return (
        <DialogDescription className="text-sm text-emerald-100">
            {isEditing
                ? "Modifica los datos de la categoría en el formulario a continuación."
                : "Complete el formulario para registrar una nueva categoría."}
        </DialogDescription>
    );
};