import { DialogFooter } from "@/modules/core/components/ui/dialog";
import { DepartmentCancelButton } from "./DepartmentCancelButton";
import { DepartmentSubmitButton } from "./DepartmentSubmitButton";

interface DepartmentModalFooterProps {
    isEditing: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const DepartmentModalFooter: React.FC<DepartmentModalFooterProps> = ({ isEditing, onClose, onSubmit }) => {
    return (
        <DialogFooter className="flex flex-col w-full space-y-3 sm:space-y-0">
            <div className="w-full sm:mb-3">
                <DepartmentCancelButton onClose={onClose} />
            </div>
            <div className="w-full">
                <DepartmentSubmitButton isEditing={isEditing} onSubmit={onSubmit} />
            </div>
        </DialogFooter>
    );
};