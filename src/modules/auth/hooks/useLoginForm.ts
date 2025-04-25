import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthModelRequest } from "../models/auth.model.request.ts";
import { useAuthContext } from "../context/AuthContext";

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState<AuthModelRequest>({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
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
      })
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