import { Background } from "./components/Background";
import { LoginCard } from "./components/LoginCard";
import { Toaster } from "sonner";

export const AuthPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <Background />

            <div className="w-full max-w-md px-4 relative z-20">
                <LoginCard />
            </div>

            <Toaster position="top-right" />
        </div>
    );
};

export default AuthPage;