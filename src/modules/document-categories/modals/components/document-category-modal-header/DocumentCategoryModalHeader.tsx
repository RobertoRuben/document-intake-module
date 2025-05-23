import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { DocumentCategoryModalTitle } from "./DocumentCategoryModalTitle";
import { DocumentCategoryModalDescription } from "./DocumentCategoryModalDescription";

interface DocumentCategoryModalHeaderProps {
    isEditing: boolean;
}

export const DocumentCategoryModalHeader: React.FC<DocumentCategoryModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <DocumentCategoryModalTitle isEditing={isEditing} />
            <DocumentCategoryModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}