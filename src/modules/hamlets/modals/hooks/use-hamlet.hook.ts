import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hamlet } from "@/modules/hamlets/model/hamlet.model";
import { 
    HamletFormValues, 
    createHamletFormSchema,
    updateHamletFormSchema
} from "../validators/hamlet.validator.schema";

export const useHamletForm = (hamlet?: Hamlet) => {
    const formSchema = hamlet ? updateHamletFormSchema : createHamletFormSchema;
    
    const form = useForm<HamletFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            settlementId: undefined
        },
    });

    useEffect(() => {
        if (hamlet) {
            form.reset({
                name: hamlet.name,
                settlementId: hamlet.settlementId
            });
        }
    }, [hamlet, form]);

    return {
        form,
    };
};