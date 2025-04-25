import { BrowserRouter } from "react-router-dom";
import { LoadingSpinnerProvider } from "./modules/core/structure/loading-spinner/providers/loading-spinner.provider.tsx";
import { AppRouter } from "./modules/routes/app.router.tsx";
import { AuthProvider } from "./modules/auth/context/auth.context.tsx";
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