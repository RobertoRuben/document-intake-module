import { motion } from "framer-motion";

export const Background = () => {
  return (
    <>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("/folders-background.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#03A64A]/80 to-black/80 z-10" />
    </>
  );
};
