import { Route } from "react-router-dom";
import HamletPage from "@/modules/hamlets/pages/HamletPage";

export const HamletRoutes = [
    <Route key="hamlets" path="/hamlets" element={<HamletPage />} />
];