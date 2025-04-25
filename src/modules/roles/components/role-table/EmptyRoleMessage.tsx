import React from "react";

export const EmptyRoleMessage: React.FC = () => {
    return (
        <div className="w-full p-8 text-center">
            <p className="text-gray-500">No se encontraron roles</p>
        </div>
    );
};