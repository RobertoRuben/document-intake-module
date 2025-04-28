import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/modules/core/components/ui/dialog";
import { Button } from "@/modules/core/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            onConfirm,
                                                            title,
                                                            description,
                                                            confirmButtonText = "Eliminar",
                                                            cancelButtonText = "Cancelar",
                                                            isLoading = false,
                                                        }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <AlertCircle className="size-6 text-destructive mx-auto mb-2" />
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelButtonText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <Trash2 className="size-4" />
                        {confirmButtonText}
                        {isLoading && (
                            <div className="border-2 border-t-transparent border-white rounded-full w-4 h-4 animate-spin"></div>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};