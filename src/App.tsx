import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./modules/core/structure/layout/Layout";
import { LoadingSpinnerProvider } from "./modules/core/structure/loading-spinner/providers/LoadingSpinnerProvider";

function App() {
  return (
    <LoadingSpinnerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Aquí van las rutas anidadas que se mostrarán dentro del Layout a través del Outlet */}
            <Route index element={<div className="p-6">Página de inicio</div>} />
            <Route path="/inicio" element={<div className="p-6">Contenido de inicio</div>} />
            <Route path="/notificaciones" element={<div className="p-6">Notificaciones</div>} />
            <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingSpinnerProvider>
  );
}

export default App;