"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { 
    FaGraduationCap, 
    FaHandsHelping, 
    FaTimes, 
    FaChevronDown,
    FaUserCircle,
    FaSearch,
    FaHome,
    FaInfoCircle,
    FaUsers,
    FaBook,
    FaUserPlus,
    FaImages,
    FaEnvelope,
    FaNewspaper,
    FaCog
} from "react-icons/fa";
import { IoLibraryOutline } from "react-icons/io5";

type Props = {
    menu?: {
        title: string;
        items?: { title: string; path: string }[];
        path?: string;
    }[];
    AdminMenu?: {
        title: string;
        items?: { title: string; path: string }[];
        path?: string;
    }[];
};

export const LeftDrawer = ({ menu, AdminMenu }: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const toggleExpanded = (title: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(title)) {
            newExpanded.delete(title);
        } else {
            newExpanded.add(title);
        }
        setExpandedItems(newExpanded);
    };

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.mobile-drawer') && !target.closest('.mobile-menu-trigger')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const currentMenu = pathname.includes("Admin") ? AdminMenu : menu;

    // Get icon for menu item
    const getMenuIcon = (title: string) => {
        const iconMap: { [key: string]: React.ReactNode } = {
            'Home': <FaHome size={16} />,
            'About': <FaInfoCircle size={16} />,
            'Our Team': <FaUsers size={16} />,
            'Courses': <FaBook size={16} />,
            'Admissions': <FaUserPlus size={16} />,
            'Media': <FaImages size={16} />,
            'Contact': <FaEnvelope size={16} />,
            'Blogs': <FaNewspaper size={16} />,
            'Profile': <FaUserCircle size={16} />,
            'Student Panel': <FaGraduationCap size={16} />,
            'Admin': <FaCog size={16} />,
            'Users': <FaUsers size={16} />,
            'Site Settings': <FaCog size={16} />,
            'Other Forms': <FaHandsHelping size={16} />,
        };
        return iconMap[title] || <FaInfoCircle size={16} />;
    };

    return (
        <>
            {/* Menu Trigger Button */}
            <button 
                className="mobile-menu-trigger lg:hidden p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm" 
                onClick={toggleDrawer}
            >
                <IoIosMenu size={22} className="text-gray-700" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Responsive Mobile Drawer */}
            <div 
                className={`
                    mobile-drawer fixed top-0 left-0 h-full w-80 sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-0 right-0 p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                        >
                            <FaTimes size={20} className="text-white" />
                        </button>

                        {/* Header Content */}
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                <IoLibraryOutline size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    IHU Portal
                                </h2>
                                <p className="text-orange-100 text-sm font-medium">
                                    Excellence in Education
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-6 relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-100" size={16} />
                        </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                    </div>
                </div>

                {/* Navigation Content */}
                <div className="flex flex-col h-full">
                    {/* Main Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="space-y-2">
                            {currentMenu?.map((item, index) => (
                                <NavigationItem 
                                    key={index}
                                    item={item}
                                    pathname={pathname}
                                    expandedItems={expandedItems}
                                    onNavigate={handleNavigation}
                                    onToggleExpanded={toggleExpanded}
                                    getIcon={getMenuIcon}
                                />
                            ))}
                        </div>
                    </nav>

                    {/* Action Buttons Section */}
                    <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                        {/* CTA Buttons */}
                        <div className="space-y-3 mb-4">
                            <button
                                onClick={() => handleNavigation("/Registration-Form")}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 shadow-md"
                            >
                                <FaGraduationCap size={18} />
                                <span>Apply for Courses</span>
                            </button>
                            
                            <button
                                onClick={() => handleNavigation("/Donate")}
                                className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white p-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
                            >
                                <FaHandsHelping size={18} />
                                <span>Support Our Mission</span>
                            </button>
                        </div>

                        {/* Auth Section */}
                        <div className="pt-4 border-t border-gray-200"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ================== NAVIGATION ITEM COMPONENT ==================

interface NavigationItemProps {
    item: {
        title: string;
        items?: { title: string; path: string }[];
        path?: string;
    };
    pathname: string;
    expandedItems: Set<string>;
    onNavigate: (path: string) => void;
    onToggleExpanded: (title: string) => void;
    getIcon: (title: string) => React.ReactNode;
}

const NavigationItem = ({ 
    item, 
    pathname, 
    expandedItems, 
    onNavigate, 
    onToggleExpanded,
    getIcon
}: NavigationItemProps) => {
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const isActive = item.path === pathname;
    const hasActiveSubItem = item.items?.some(subItem => subItem.path === pathname);

    if (hasSubItems) {
        return (
            <div className="mb-2">
                {/* Parent Item */}
                <div className="flex items-center">
                    {item.path ? (
                        <button
                            onClick={() => onNavigate(item.path!)}
                            className={`
                                flex-1 text-left p-4 rounded-xl font-medium transition-all duration-200 flex items-center gap-3
                                ${isActive || hasActiveSubItem
                                    ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="text-orange-500">{getIcon(item.title)}</span>
                            {item.title}
                        </button>
                    ) : (
                        <div className={`
                            flex-1 p-4 rounded-xl font-medium flex items-center gap-3
                            ${hasActiveSubItem
                                ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                                : 'text-gray-700'
                            }
                        `}>
                            <span className="text-orange-500">{getIcon(item.title)}</span>
                            {item.title}
                        </div>
                    )}
                    
                    <button
                        onClick={() => onToggleExpanded(item.title)}
                        className="p-2 ml-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <FaChevronDown 
                            size={14} 
                            className={`
                                text-gray-400 transition-transform duration-200
                                ${isExpanded ? 'rotate-180' : ''}
                            `}
                        />
                    </button>
                </div>

                {/* Sub Items */}
                {isExpanded && (
                    <div className="mt-2 ml-6 space-y-1 border-l-2 border-orange-200 pl-4">
                        {item.items?.map((subItem, subIndex) => (
                            <button
                                key={subIndex}
                                onClick={() => onNavigate(subItem.path)}
                                className={`
                                    w-full text-left p-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2
                                    ${pathname === subItem.path
                                        ? 'text-orange-600 bg-orange-50 font-medium border border-orange-200 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                {subItem.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Simple Item
    return (
        <button
            onClick={() => onNavigate(item.path!)}
            className={`
                w-full text-left p-4 rounded-xl font-medium transition-all duration-200 mb-2 flex items-center gap-3
                ${isActive
                    ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }
            `}
        >
            <span className="text-orange-500">{getIcon(item.title)}</span>
            {item.title}
        </button>
    );
};
