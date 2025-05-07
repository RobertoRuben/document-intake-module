import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "../../models/employee.model";
import { employeeFormSchema, EmployeeFormValues } from "../../validators/employee.validator.schema";

export const useEmployeeForm = (employee?: Employee) => {
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            dni: 0,
            names: "",
            paternalSurname: "",
            maternalSurname: "",
            gender: "",
            positionId: 0,
            departmentId: 0
        },
    });

    useEffect(() => {
        if (employee) {
            form.reset({
                dni: employee.dni,
                names: employee.names,
                paternalSurname: employee.paternalSurname,
                maternalSurname: employee.maternalSurname,
                gender: employee.gender || "",
                positionId: employee.positionId,
                departmentId: employee.departmentId
            });
        }
    }, [employee, form]);

    return {
        form,
    };
};