import * as z from "zod";

export const departmentConnectionFormSchema = z
  .object({
    sourceDepartmentId: z
      .number()
      .int({ message: "El ID del departamento origen debe ser un número entero" })
      .positive({ message: "El ID del departamento origen debe ser un número positivo" })
      .min(1, { message: "Debe seleccionar un departamento origen" }),
    
    targetDepartmentId: z
      .number()
      .int({ message: "El ID del departamento destino debe ser un número entero" })
      .positive({ message: "El ID del departamento destino debe ser un número positivo" })
      .min(1, { message: "Debe seleccionar un departamento destino" }),
  })
  .refine(
    data => data.sourceDepartmentId !== data.targetDepartmentId, 
    {
      message: "El departamento destino debe ser diferente al departamento origen",
      path: ["targetDepartmentId"] // Esto indica qué campo debe mostrar el error
    }
  );

export type DepartmentConnectionFormValues = z.infer<typeof departmentConnectionFormSchema>;