type SidebarOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
    if (!isOpen) return null;
    
    return (
        <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
        ></div>
    );
}