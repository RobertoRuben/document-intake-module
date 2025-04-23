import { motion } from "framer-motion";
import { Button } from "@/modules/core/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
    >
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#03A64A] hover:bg-[#028a3d] text-white transition-all duration-300 ease-out"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </motion.div>
  );
};