import * as React from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import { cn } from "@/lib/utils";
import { DataKeyAccessor, TextAccessor } from "react-widgets/esm/Accessors";
import { DropdownProps } from "react-widgets/esm/DropdownList";

export interface DropdownSearchableProps<TDataItem = unknown> extends Omit<DropdownProps<TDataItem>, "onChange"> {
  data: TDataItem[];
  value?: TDataItem;
  defaultValue?: TDataItem;
  textField?: TextAccessor;
  dataKey?: DataKeyAccessor;
  onChange?: (value: TDataItem) => void;
  filter?: "contains" | "startsWith" | "eq" | boolean | ((dataItem: TDataItem, searchTerm: string) => boolean);
  placeholder?: string;
  disabled?: boolean | TDataItem[];
  readOnly?: boolean;
  groupBy?: string | ((dataItem: TDataItem) => any);
  className?: string;
  renderListItem?: (props: { item: TDataItem }) => React.ReactNode;
  renderValue?: (props: { item: TDataItem }) => React.ReactNode;
  searchTerm?: string;
  allowCreate?: boolean | "onFilter";
  onCreate?: (searchTerm: string) => void;
  dropUp?: boolean;
  autoComplete?: "on" | "off";
  busy?: boolean;
  busySpinner?: React.ReactNode;
}

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
  const handleChange = (value: TDataItem, _metadata: any) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div
      className={cn(
        "dropdown-searchable-container text-sm font-sans", // Mantiene el largo original y reduce el ancho
        className
      )}
    >
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
        className="text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-500" 
      />
    </div>
  );
}

export default DropdownSearchable;