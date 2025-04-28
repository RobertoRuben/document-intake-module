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
        <DialogFooter className="flex flex-col w-full space-y-3 sm:space-y-0">
            <div className="w-full sm:mb-3">
                <CancelButton onClose={onClose} />
            </div>
            <div className="w-full">
                <SubmitButton isEditing={isEditing} onSubmit={onSubmit} />
            </div>
        </DialogFooter>
    );
};