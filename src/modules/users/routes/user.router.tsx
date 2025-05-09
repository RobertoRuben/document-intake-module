import { Route } from "react-router-dom";
import UserPage from "@/modules/users/page/UserPage";

export const UserRoutes = [
    <Route key="users" path="/users" element={<UserPage />} />
];