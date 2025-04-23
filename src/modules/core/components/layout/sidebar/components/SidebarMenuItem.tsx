import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem, NavSubItem } from '../types/sidebar.types';

type SidebarMenuItemProps = {
    item: NavItem;
    openMenus: { [key: string]: boolean };
    toggleMenu: (name: string) => void;
    onClose: () => void;
    filteredSubItems?: NavSubItem[];
    unconfirmedCount: number;
};

export function SidebarMenuItem({ 
    item, 
    openMenus, 
    toggleMenu, 
    onClose,
    filteredSubItems, 
    unconfirmedCount 
}: SidebarMenuItemProps) {
    if (item.subItems) {
        return (
            <div>
                <button
                    onClick={() => toggleMenu(item.name)}
                    className="flex items-center justify-between w-full p-2 hover:bg-[#028a3b] rounded focus:outline-none font-semibold"
                    aria-expanded={openMenus[item.name] || false}
                    disabled={filteredSubItems?.length === 0}
                >
                    <div className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" strokeWidth={3} />
                        <span>{item.name}</span>
                        {item.name === "Inbox" && unconfirmedCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                {unconfirmedCount}
                            </span>
                        )}
                    </div>
                    {filteredSubItems && filteredSubItems.length > 0 && (
                        openMenus[item.name] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                </button>

                <ul
                    className={`ml-4 mt-2 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                        openMenus[item.name]
                            ? 'max-h-[9999px] opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                >
                    {filteredSubItems?.map((subItem, subIndex) => (
                        <li key={subIndex}>
                            <Link
                                to={subItem.path}
                                className="flex justify-between items-center p-2 hover:bg-[#028a3b] rounded"
                                onClick={onClose}
                            >
                                <span>{subItem.name}</span>
                                {subItem.name === "Recibidos" && unconfirmedCount > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unconfirmedCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    
    return (
        <Link
            to={item.path || '#'}
            className="flex items-center p-2 hover:bg-[#028a3b] rounded font-semibold relative"
            onClick={onClose}
        >
            <item.icon className="w-5 h-5 mr-2" strokeWidth={3} />
            {item.name}
        </Link>
    );
}