import { motion } from "framer-motion";
import { Input } from "@/modules/core/components/ui/input";
import { Label } from "@/modules/core/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const PasswordInput = ({ value, onChange, disabled }: PasswordInputProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="space-y-2">
      <Label htmlFor="password" className="text-gray-800 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Contraseña
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="w-full bg-white/50 backdrop-blur-sm focus:ring-[#03A64A] focus:border-[#03A64A]"
      />
    </motion.div>
  );
};