import React, { ReactNode } from "react";
import { Eye, Pencil, Trash2, MoreHorizontal, Download, Copy } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";

export type ActionType = 'edit' | 'delete' | 'view' | 'download' | 'copy' | 'custom';

interface ActionButton {
  type: ActionType;
  label?: string;
  icon?: ReactNode;
  onClick: (id?: string | number) => void;
  className?: string;
  disabled?: boolean;
  hidden?: boolean;
}

interface TableActionsProps {
  id?: string | number;
  actions: ActionButton[];
  variant?: 'buttons' | 'dropdown' | 'hybrid';
  maxVisibleButtons?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const TableActions: React.FC<TableActionsProps> = ({
  id,
  actions = [],
  variant = 'buttons',
  maxVisibleButtons = 2,
  size = 'default',
  className = '',
}) => {
  const visibleActions = actions.filter(action => !action.hidden);
  
  const getDefaultIcon = (type: ActionType): ReactNode => {
    switch (type) {
      case 'edit': return <Pencil className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />;
      case 'delete': return <Trash2 className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />;
      case 'view': return <Eye className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />;
      case 'download': return <Download className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />;
      case 'copy': return <Copy className={size === 'sm' ? "w-4 h-4" : "w-5 h-5"} />;
      default: return null;
    }
  };

  const getDefaultClass = (type: ActionType): string => {
    switch (type) {
      case 'edit': return 'bg-amber-500 text-white hover:bg-amber-600';
      case 'delete': return 'bg-red-500 text-white hover:bg-red-600';
      case 'view': return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'download': return 'bg-green-500 text-white hover:bg-green-600';
      case 'copy': return 'bg-purple-500 text-white hover:bg-purple-600';
      default: return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getDefaultLabel = (type: ActionType): string => {
    switch (type) {
      case 'edit': return 'Editar';
      case 'delete': return 'Eliminar';
      case 'view': return 'Ver';
      case 'download': return 'Descargar';
      case 'copy': return 'Copiar';
      default: return 'Acción';
    }
  };

  const renderActionButtons = () => {
    return visibleActions.map((action, index) => (
      <Button
        key={`${action.type}-${index}`}
        onClick={() => action.onClick(id)}
        className={`${action.className || getDefaultClass(action.type)} ${index > 0 ? 'ml-2' : ''}`}
        size={size === 'lg' ? 'default' : size}
        disabled={action.disabled}
        title={action.label || getDefaultLabel(action.type)}
      >
        {action.icon || getDefaultIcon(action.type)}
        {action.label && size !== 'sm' && <span className="ml-2 hidden sm:inline">{action.label}</span>}
      </Button>
    ));
  };

  const renderLimitedButtons = () => {
    const visibleButtons = visibleActions.slice(0, maxVisibleButtons);
    const dropdownActions = visibleActions.slice(maxVisibleButtons);

    return (
      <>
        {visibleButtons.map((action, index) => (
          <Button
            key={`${action.type}-${index}`}
            onClick={() => action.onClick(id)}
            className={`${action.className || getDefaultClass(action.type)} ${index > 0 ? 'ml-2' : ''}`}
            size={size === 'lg' ? 'default' : size}
            disabled={action.disabled}
            title={action.label || getDefaultLabel(action.type)}
          >
            {action.icon || getDefaultIcon(action.type)}
            {action.label && size !== 'sm' && <span className="ml-2 hidden sm:inline">{action.label}</span>}
          </Button>
        ))}

        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size={size === 'lg' ? 'default' : size} 
                variant="outline" 
                className="ml-2"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dropdownActions.map((action, index) => (
                <DropdownMenuItem
                  key={`dropdown-${action.type}-${index}`}
                  onClick={() => action.onClick(id)}
                  disabled={action.disabled}
                >
                  {action.icon || getDefaultIcon(action.type)}
                  <span className="ml-2">{action.label || getDefaultLabel(action.type)}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </>
    );
  };

  const renderDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size={size === 'lg' ? 'default' : size} 
            variant="outline"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visibleActions.map((action, index) => (
            <DropdownMenuItem
              key={`dropdown-${action.type}-${index}`}
              onClick={() => action.onClick(id)}
              disabled={action.disabled}
              className={action.type === 'delete' ? 'text-red-600' : ''}
            >
              {action.icon || getDefaultIcon(action.type)}
              <span className="ml-2">{action.label || getDefaultLabel(action.type)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className={`flex items-center ${className}`}>
      {variant === 'buttons' && renderActionButtons()}
      {variant === 'dropdown' && renderDropdown()}
      {variant === 'hybrid' && renderLimitedButtons()}
    </div>
  );
};