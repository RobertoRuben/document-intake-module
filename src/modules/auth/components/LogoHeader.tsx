import { motion } from 'framer-motion'

export const LogoHeader = () => {
    return (
        <div className="text-center mb-8">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
            >
                <motion.img
                    src="/mda-logo.png" 
                    alt="Logo de la institución"
                    className="mx-auto h-40 w-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-3xl font-bold bg-gradient-to-r from-[#03A64A] to-[#028a3d] bg-clip-text text-transparent"
            >
                SGDOC
            </motion.h2>
        </div>
    )
}