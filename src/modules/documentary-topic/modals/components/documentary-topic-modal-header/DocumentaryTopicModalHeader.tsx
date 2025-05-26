import { DialogHeader } from "@/modules/core/components/ui/dialog";
import { DocumentaryTopicModalTitle } from "./DocumentaryTopicModalTitle";
import { DocumentaryTopicModalDescription } from "./DocumentaryTopicModalDescription";

interface DocumentaryTopicModalHeaderProps {
    isEditing: boolean;
}

export const DocumentaryTopicModalHeader: React.FC<DocumentaryTopicModalHeaderProps> = ({ isEditing }) => {
    return (
        <DialogHeader className="bg-gradient-to-l from-[#028a3b] via-[#014920] to-black text-white p-6 rounded-t-lg shadow-md">
            <DocumentaryTopicModalTitle isEditing={isEditing} />
            <DocumentaryTopicModalDescription isEditing={isEditing} />
        </DialogHeader>
    )
}