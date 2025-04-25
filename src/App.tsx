import { BrowserRouter } from "react-router-dom";
import { LoadingSpinnerProvider } from "./modules/core/structure/loading-spinner/providers/LoadingSpinnerProvider";
import { AppRouter } from "./modules/routes/AppRouter";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import {Toaster} from "sonner";

function App() {
    return (
        <LoadingSpinnerProvider>
            <BrowserRouter>
                <AuthProvider>
                    <AppRouter />
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </BrowserRouter>
        </LoadingSpinnerProvider>
    );
}

export default App;