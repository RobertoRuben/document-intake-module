import React, { ReactNode } from "react";

interface EmptyStateMessageProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  message = "No se encontraron elementos",
  icon,
  className = "w-full p-8 text-center",
  action
}) => {
  return (
    <div className={className}>
      {icon && <div className="flex justify-center mb-3">{icon}</div>}
      <p className="text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};