import { DocumentCategoryModalForm } from "./components/document-category-modal-form/DocumentCategoryModalForm";
import { DocumentCategory } from "../model/document-category.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { DocumentCategoryModalHeader } from "./components/document-category-modal-header/DocumentCategoryModalHeader";

interface DocumentCategoryModalProps {
    isOpen: boolean;
    documentCategory?: DocumentCategory;
    onClose: () => void;
    onSubmit: (data: DocumentCategory) => Promise<boolean>;
}

export const DocumentCategoryModal: React.FC<DocumentCategoryModalProps> = ({
    isOpen,
    documentCategory,
    onClose,
    onSubmit
}) => {
    const [internalCategory, setInternalCategory] = useState<DocumentCategory | undefined>(documentCategory);
    const isEditing = !!internalCategory;

    useEffect(() => {
        if (isOpen) {
            setInternalCategory(documentCategory);
        }
    }, [isOpen, documentCategory]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden [&>button]:hidden max-h-[90vh]">
                <DocumentCategoryModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <DocumentCategoryModalForm 
                        documentCategory={internalCategory}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};