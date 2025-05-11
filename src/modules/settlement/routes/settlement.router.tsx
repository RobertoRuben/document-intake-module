import { Route } from "react-router-dom";
import SettlementPage from "@/modules/settlement/pages/SettlementPage";

export const SettlementRoutes = [
    <Route key="settlements" path="/settlements" element={<SettlementPage />} />
];