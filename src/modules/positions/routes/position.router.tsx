import { Route } from "react-router-dom";
import PositionPage from "@/modules/positions/pages/PositionPage";

export const PositionRoutes = [
    <Route key="positions" path="/positions" element={<PositionPage />} />
];