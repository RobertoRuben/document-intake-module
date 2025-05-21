import React from "react";
import { ChevronDown, Columns } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";
import { set } from "react-hook-form";

interface ColumnDefinition {
  id: string;
  isVisible: boolean;
  toggleVisibility: (value: boolean) => void;
  getCanHide: () => boolean;
  label?: string;
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnDefinition[];
  buttonText?: string;
  columnLabels?: Record<string, string>;
  isMobileView?: boolean;
}

export const ColumnVisibilityDropdown: React.FC<
  ColumnVisibilityDropdownProps
> = ({
  columns,
  buttonText = "Columnas",
  columnLabels = {},
  isMobileView = false,
}) => {
  const getColumnLabel = (column: ColumnDefinition): string => {
    if (column.label) {
      return column.label;
    }
    if (columnLabels[column.id]) {
      return columnLabels[column.id];
    }

    const commonColumnTranslations: Record<string, string> = {
      // Basic columns
      id: "ID",
      name: "Nombre",
      title: "Título",
      description: "Descripción",
      status: "Estado",
      type: "Tipo",
      category: "Categoría",
      code: "Código",

      // Dates
      createdAt: "Fecha de creación",
      updatedAt: "Fecha de actualización",
      date: "Fecha",
      startDate: "Fecha de inicio",
      endDate: "Fecha de fin",
      birthDate: "Fecha de nacimiento",

      // Users and persons
      firstName: "Nombre",
      lastName: "Apellido",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono",
      address: "Dirección",
      role: "Rol",
      username: "Usuario",
      password: "Contraseña",
      names: "Nombres",
      paternalSurname: "Apellido Paterno",
      maternalSurname: "Apellido Materno",
      gender: "Género",
      isActive: "Estado",
      roleName: "Rol",
      employeeName: "Empleado",

      //Departments
      department: "Departamento",
      departmentName: "Nombre del departamento",
      departmentCode: "Código del departamento",
      sourceDepartmentName: "Departamento origen",
      targetDepartmentName: "Departamento destino",

      //Positions
      position: "Posición",
      positionName: "Nombre de la posición",

      //Setlements
      settlement: "Asentamiento",
      settlementName: "Nombre del asentamiento",

      // Quantities
      amount: "Cantidad",
      price: "Precio",
      total: "Total",
      quantity: "Cantidad",
      number: "Número",

      // Documents
      documentType: "Tipo de documento",
      documentNumber: "Número de documento",
      fileName: "Nombre de archivo",
      fileSize: "Tamaño de archivo",
      fileType: "Tipo de archivo",

      // Especific UI
      actions: "Acciones",
      options: "Opciones",
      details: "Detalles",
      select: "Seleccionar",
      edit: "Editar",
      delete: "Eliminar",
    };

    if (commonColumnTranslations[column.id]) {
      return commonColumnTranslations[column.id];
    }

    const readableLabel = column.id
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    return readableLabel;
  };  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full font-medium ${
            isMobileView ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isMobileView ? "justify-center" : ""
            }`}
          >
            <Columns className="h-4 w-4" />
            <span className="font-semibold">{buttonText}</span>
          </div>
          {!isMobileView && <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {columns
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.isVisible}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {getColumnLabel(column)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
