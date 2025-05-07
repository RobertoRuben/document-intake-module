import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department } from "@/modules/departments/models/department.model";
import { departmentFormSchema, DepartmentFormValues } from "@/modules/departments/modals/validators/department.validator.schema";

export const useDepartmentForm = (department?: Department) => {
    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentFormSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (department) {
            form.reset({
                name: department.name,
            });
        }
    }, [department, form]);

    return {
        form,
    };
};