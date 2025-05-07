import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Position } from "../../model/position.model";
import { positionFormSchema, PositionFormValues } from "@/modules/positions/modals/validators/position.validator.schema";

export const usePositionForm = (position?: Position) => {
    const form = useForm<PositionFormValues>({
        resolver: zodResolver(positionFormSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (position) {
            form.reset({
                name: position.name,
            });
        }
    }, [position, form]);

    return {
        form,
    };
};