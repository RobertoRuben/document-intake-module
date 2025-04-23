import { motion } from "framer-motion";
import { useLoginForm } from "../hooks/useLoginForm";
import { UsernameInput } from "./login-form/UsernameInput";
import { PasswordInput } from "./login-form/PasswordInput";
import { SubmitButton } from "./login-form/SubmitButton";

export const LoginForm = () => {
  const { credentials, isLoading, handleChange, handleSubmit } = useLoginForm();

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <UsernameInput 
        value={credentials.username}
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <PasswordInput 
        value={credentials.password}
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <SubmitButton isLoading={isLoading} />
    </motion.form>
  );
};