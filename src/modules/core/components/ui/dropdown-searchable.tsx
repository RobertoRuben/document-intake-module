/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import { cn } from "@/lib/utils";
import { DataKeyAccessor, TextAccessor } from "react-widgets/esm/Accessors";
import { DropdownProps } from "react-widgets/esm/DropdownList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DropdownSearchableProps<TDataItem = unknown> extends Omit<DropdownProps<TDataItem>, 'onChange'> {
  /**
   * Datos para mostrar en el dropdown
   */
  data: TDataItem[];
  
  /**
   * Valor seleccionado actualmente
   */
  value?: TDataItem;
  
  /**
   * Valor por defecto para el dropdown
   */
  defaultValue?: TDataItem;
  
  /**
   * Campo a mostrar como texto (si los items son objetos)
   */
  textField?: TextAccessor;
  
  /**
   * Campo a usar como clave única (si los items son objetos)
   */
  dataKey?: DataKeyAccessor;
  
  /**
   * Función que se llama cuando cambia el valor
   */
  onChange?: (value: TDataItem) => void;
  
  /**
   * Método de filtrado para búsqueda
   */
  filter?: "contains" | "startsWith" | "eq" | boolean | ((dataItem: TDataItem, searchTerm: string) => boolean);
  
  /**
   * Placeholder cuando no hay valor seleccionado
   */
  placeholder?: string;
  
  /**
   * Deshabilitar el dropdown
   */
  disabled?: boolean | TDataItem[];
  
  /**
   * Modo de solo lectura
   */
  readOnly?: boolean;
  
  /**
   * Agrupar elementos por
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupBy?: string | ((dataItem: TDataItem) => any);
  
  /**
   * Clase CSS adicional para el contenedor
   */
  className?: string;
  
  /**
   * Personalización del renderizado de los elementos de la lista
   */
  renderListItem?: (props: { item: TDataItem }) => React.ReactNode;
  
  /**
   * Personalización del renderizado del valor seleccionado
   */
  renderValue?: (props: { item: TDataItem }) => React.ReactNode;
  
  /**
   * Término de búsqueda controlado
   */
  searchTerm?: string;
  
  /**
   * Permite crear nuevos elementos
   */
  allowCreate?: boolean | "onFilter";
  
  /**
   * Función llamada cuando se crea un nuevo elemento
   */
  onCreate?: (searchTerm: string) => void;
  
  /**
   * Indica si el dropdown debe abrirse hacia arriba
   */
  dropUp?: boolean;
  
  /**
   * Habilita el autocompletado
   */
  autoComplete?: "on" | "off";
  
  /**
   * Indica si está ocupado (cargando datos)
   */
  busy?: boolean;
  
  /**
   * Componente personalizado para el spinner de carga
   */
  busySpinner?: React.ReactNode;
}

/**
 * Componente DropdownSearchable
 * 
 * Un componente reutilizable de lista desplegable con capacidad de búsqueda.
 * Basado en el componente DropdownList de react-widgets.
 * 
 * @example
 * ```jsx
 * <DropdownSearchable
 *   data={["Rojo", "Verde", "Azul", "Amarillo"]}
 *   defaultValue="Rojo"
 *   placeholder="Selecciona un color"
 *   filter="contains"
 * />
 * ```
 * 
 * @example
 * ```jsx
 * <DropdownSearchable
 *   data={usuarios}
 *   textField="nombre"
 *   dataKey="id"
 *   onChange={handleChange}
 *   placeholder="Selecciona un usuario"
 * />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DropdownSearchable<TDataItem = unknown>({
  data,
  value,
  defaultValue,
  textField,
  dataKey,
  onChange,
  filter = "contains",
  placeholder,
  disabled,
  readOnly,
  groupBy,
  className,
  renderListItem,
  renderValue,
  searchTerm,
  allowCreate,
  onCreate,
  dropUp,
  autoComplete,
  busy,
  busySpinner,
  ...props
}: DropdownSearchableProps<TDataItem>) {
  // Función para manejar el cambio y adaptarlo al formato esperado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: TDataItem, _metadata: any) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("dropdown-searchable-container", className)}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <DropdownList<TDataItem>
        data={data}
        value={value}
        defaultValue={defaultValue}
        textField={textField}
        dataKey={dataKey}
        onChange={handleChange}
        filter={filter}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        groupBy={groupBy}
        renderListItem={renderListItem}
        renderValue={renderValue}
        searchTerm={searchTerm}
        allowCreate={allowCreate}
        onCreate={onCreate}
        dropUp={dropUp}
        autoComplete={autoComplete}
        busy={busy}
        busySpinner={busySpinner}
        {...props}
      />
    </div>
  );
}

export default DropdownSearchable;