import { useLocation } from "react-router-dom";

export default function ContentHeader() {
  const location = useLocation();
  
  // Obtener solo el último segmento de la ruta y formatearlo
  const getCurrentPageTitle = (): string => {
    const path = location.pathname;
    const lastSegment = path.split('/').filter(Boolean).pop() || 'Inicio';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  const pageTitle = getCurrentPageTitle();

  return (
    <div className="bg-white mb-6 p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center">
        <h1 className="text-xl font-semibold text-gray-500">
          {pageTitle}
        </h1>
      </div>
    </div>
  );
}