import { DocumentaryTopicModalForm } from "./components/documentary-topic-modal-form/DocumentaryTopicModalForm";
import { DocumentaryTopic } from "../model/documentary-topic-model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { DocumentaryTopicModalHeader } from "./components/documentary-topic-modal-header/DocumentaryTopicModalHeader";

interface DocumentaryTopicModalProps {
    isOpen: boolean;
    documentaryTopic?: DocumentaryTopic;
    onClose: () => void;
    onSubmit: (data: DocumentaryTopic) => Promise<boolean>;
}

export const DocumentaryTopicModal: React.FC<DocumentaryTopicModalProps> = ({
    isOpen,
    documentaryTopic,
    onClose,
    onSubmit
}) => {
    const [internalTopic, setInternalTopic] = useState<DocumentaryTopic | undefined>(documentaryTopic);
    const isEditing = !!internalTopic;

    useEffect(() => {
        if (isOpen) {
            setInternalTopic(documentaryTopic);
        }
    }, [isOpen, documentaryTopic]);

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
                <DocumentaryTopicModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <DocumentaryTopicModalForm 
                        documentaryTopic={internalTopic}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};