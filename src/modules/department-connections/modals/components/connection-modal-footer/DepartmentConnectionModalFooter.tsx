import { DialogFooter } from "@/modules/core/components/ui/dialog";
import { ModalCancelButton } from "@/globals/components/ModalCancelButton";
import { ModalSubmitButton } from "@/globals/components/ModalSubmitButton";

interface DepartmentConnectionModalFooterProps {
    isEditing: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const DepartmentConnectionModalFooter: React.FC<DepartmentConnectionModalFooterProps> = ({ 
    isEditing, 
    onClose, 
    onSubmit 
}) => {
    return (
        <DialogFooter className="flex flex-col w-full space-y-3 sm:space-y-0">
            <div className="w-full sm:mb-3">
                <ModalCancelButton onClose={onClose} />
            </div>
            <div className="w-full">
                <ModalSubmitButton isEditing={isEditing} onSubmit={onSubmit} />
            </div>
        </DialogFooter>
    );
};