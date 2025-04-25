import { DialogFooter } from "@/modules/core/components/ui/dialog";
import { CancelButton } from "./CancelButton";
import { SubmitButton } from "./SubmitButton";

interface RoleModalFooterProps {
    isEditing: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const RoleModalFooter: React.FC<RoleModalFooterProps> = ({ isEditing, onClose, onSubmit }) => {
    return (
        <DialogFooter className="p-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <CancelButton onClose={onClose} />
            <SubmitButton isEditing={isEditing} onSubmit={onSubmit} />
        </DialogFooter>
    );
};