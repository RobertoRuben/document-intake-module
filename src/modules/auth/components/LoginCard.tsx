import { motion } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { LogoHeader } from "./LogoHeader";

export const LoginCard = () => {
  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md relative z-20"
      >
        <LogoHeader />
        <LoginForm />
      </motion.div>
  );
};