import { Route } from "react-router-dom";
import SettlementPage from "@/modules/settlements/pages/SettlementPage";

export const SettlementRoutes = [
    <Route key="settlements" path="/settlements" element={<SettlementPage />} />
];