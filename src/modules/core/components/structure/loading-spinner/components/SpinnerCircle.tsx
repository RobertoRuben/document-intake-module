import { motion } from 'framer-motion';
import { SpinnerCircleProps } from '../types/loading-spinner.types';

export default function SpinnerCircle({ size, color, backgroundColor }: SpinnerCircleProps) {
    return (
        <motion.div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `4px solid ${backgroundColor}`,
                borderTopColor: color,
                borderRightColor: color,
            }}
            animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
                borderColor: [backgroundColor, color, backgroundColor],
                borderTopColor: [color, backgroundColor, color],
                borderRightColor: [color, backgroundColor, color],
            }}
            transition={{
                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
        />
    );
}