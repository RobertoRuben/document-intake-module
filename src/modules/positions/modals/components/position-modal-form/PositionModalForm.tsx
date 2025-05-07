import React from "react";
import { Form } from "@/modules/core/components/ui/form";
import { Position } from "@/modules/positions/model/position.model";
import { PositionModalFooter } from "../position-modal-footer/PositionModalFooter";
import { PositionFormFields } from "./PositionFormFields";
import { usePositionForm } from "../../hooks/use-position.hook";
import { PositionFormValues } from "@/modules/positions/modals/validators/position.validator.schema";

interface PositionModalFormProps {
    position?: Position;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: Position) => Promise<boolean>;
}

export const PositionModalForm: React.FC<PositionModalFormProps> = ({
    position,
    isEditing,
    onClose,
    onSubmit,
}) => {

    const { form } = usePositionForm(position);

    const handleSubmit = async (values: PositionFormValues) => {
        const positionData: Position = {
            id: position?.id || undefined,
            name: values.name,
        };

        const success = await onSubmit(positionData);
        if (success) {
            onClose();
        }
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
                <div className="mb-6">
                    <PositionFormFields form={form} />
                </div>
                <PositionModalFooter
                    isEditing={isEditing}
                    onClose={onClose}
                    onSubmit={form.handleSubmit(handleSubmit)}
                />
            </form>
        </Form>
    );
};