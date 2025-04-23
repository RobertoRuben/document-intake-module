import { motion } from 'framer-motion';
import { SpinnerMessageProps } from '../types/loading-spinner.types';

export default function SpinnerMessage({ message }: SpinnerMessageProps) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-center text-gray-600 dark:text-gray-300 font-semibold text-sm sm:text-base"
        >
            {message}
        </motion.p>
    );
}