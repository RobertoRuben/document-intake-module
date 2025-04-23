import { X } from 'lucide-react';
import logo from '../../../assets/mda-logo.png';

type SidebarHeaderProps = {
    onClose: () => void;
};

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex justify-center items-center w-full">
                <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
            </div>
            <button
                onClick={onClose}
                className="lg:hidden"
                aria-label="Cerrar menú"
            >
                <X className="h-6 w-6" strokeWidth={3} />
            </button>
        </div>
    );
}