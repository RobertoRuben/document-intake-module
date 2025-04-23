import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import SpinnerCircle from './components/SpinnerCircle';
import SpinnerMessage from './components/SpinnerMessage';
import { LoadingSpinnerProps } from './types/loading-spinner.types';

export default function LoadingSpinner({
    size = 'md',
    color = '#03A64A',
    backgroundColor = 'rgba(3, 166, 74, 0.2)',
    message = 'Cargando...',
    className
}: LoadingSpinnerProps) {
    const sizes = {
        sm: 40,
        md: 60,
        lg: 80
    };

    const spinnerSize = sizes[size];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50",
                    className
                )}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-[90vw] w-full sm:w-auto"
                >
                    <div className="flex flex-col items-center">
                        <SpinnerCircle 
                            size={spinnerSize}
                            color={color}
                            backgroundColor={backgroundColor}
                        />
                        <SpinnerMessage message={message} />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}