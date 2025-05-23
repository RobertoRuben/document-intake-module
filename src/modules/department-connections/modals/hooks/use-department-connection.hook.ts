import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentConnection } from "@/modules/department-connections/model/department-connection.model";
import { 
    DepartmentConnectionFormValues,
    departmentConnectionFormSchema
} from "../validators/department-connection.validator.schema";

export const useDepartmentConnectionForm = (departmentConnection?: DepartmentConnection) => {
    const form = useForm<DepartmentConnectionFormValues>({
        resolver: zodResolver(departmentConnectionFormSchema),
        defaultValues: {
            sourceDepartmentId: undefined,
            targetDepartmentId: undefined
        },
    });

    useEffect(() => {
        if (departmentConnection) {
            form.reset({
                sourceDepartmentId: departmentConnection.sourceDepartmentId,
                targetDepartmentId: departmentConnection.targetDepartmentId
            });
        }
    }, [departmentConnection, form]);

    return {
        form,
    };
};