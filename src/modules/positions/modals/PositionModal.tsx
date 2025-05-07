import { PositionModalForm } from "./components/position-modal-form/PositionModalForm";
import { Position } from "../model/position.model";
import { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/modules/core/components/ui/dialog";
import { PositionModalHeader } from "./components/position-modal-header/PositionModalHeader";

interface PositionModalProps {
    isOpen: boolean;
    position?: Position;
    onClose: () => void;
    onSubmit: (data: Position) => Promise<boolean>;
}

export const PositionModal: React.FC<PositionModalProps> = ({
    isOpen,
    position,
    onClose,
    onSubmit
}) => {

    const [internalPosition, setInternalPosition] = useState<Position | undefined>(position);
    const isEditing = !!internalPosition;

    useEffect(() => {
        if (isOpen) {
            setInternalPosition(position);
        }
    }, [isOpen, position]);

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
                <PositionModalHeader isEditing={isEditing} />
                <div className="max-h-[calc(90vh-130px)] overflow-y-auto">
                    <PositionModalForm 
                        position={internalPosition}
                        isEditing={isEditing}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};