import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthModelRequest } from "../models/authModelRequest";

const useAuth = () => {
  const login = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          localStorage.setItem('isAuthenticated', 'true');
          resolve();
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  };

  return { login };
};

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState<AuthModelRequest>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
    setCredentials({
      username: "",
      password: "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.username, credentials.password);

      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión exitosamente en SGDOC",
      });

      navigate("/inicio");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      toast.error("Error de autenticación", {
        description: "Las credenciales ingresadas son incorrectas o falló la conexión."
      });
    }

    setIsLoading(false);
  };

  return {
    credentials,
    isLoading,
    handleChange,
    handleSubmit
  };
};