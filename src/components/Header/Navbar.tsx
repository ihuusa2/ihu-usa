'use client'

import { usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect } from 'react'
import HeaderLink from "./HeaderLink";
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

// Types
interface MenuItemType {
    title: string;
    path: string;
}

interface MenuType {
    title: string;
    items?: MenuItemType[];
    path?: string;
}

interface NavbarProps {
    menu?: MenuType[];
    AdminMenu?: MenuType[];
}

const Navbar = ({ AdminMenu, menu }: NavbarProps) => {
    const pathname = usePathname()
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    // Determine which menu to show
    const currentMenu = pathname.toLowerCase().startsWith('/admin') ? AdminMenu : menu;
    
    // Debug log to check if component is rendering
    console.log('Navbar rendering with menu:', currentMenu?.map(item => item.title));

    // Handle mouse enter for dropdown (desktop)
    const handleMouseEnter = (index: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveDropdown(index);
    };

    // Handle mouse leave for dropdown (desktop)
    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    // Helper function to close mobile menu and restore scroll
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileExpandedItems(new Set());
        
        // Restore body scroll
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        
        // Focus back to hamburger button
        setTimeout(() => {
            hamburgerRef.current?.focus();
        }, 100);
    };

    // Handle mobile menu toggle
    const toggleMobileMenu = () => {
        console.log('Toggle mobile menu clicked, current state:', mobileMenuOpen);
        
        if (!mobileMenuOpen) {
            // Open menu
            setMobileMenuOpen(true);
            
            // Prevent body scroll when menu opens
            const scrollY = window.scrollY;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.documentElement.classList.add('menu-open');
            document.body.classList.add('menu-open');
            
            // Focus the close button when menu opens
            setTimeout(() => {
                const closeButton = document.querySelector('[data-mobile-close]') as HTMLButtonElement;
                if (closeButton) {
                    closeButton.focus();
                }
            }, 300);
        } else {
            closeMobileMenu();
        }
    };

    // Handle mobile item expansion
    const toggleMobileExpanded = (title: string) => {
        const newExpanded = new Set(mobileExpandedItems);
        if (newExpanded.has(title)) {
            newExpanded.delete(title);
        } else {
            newExpanded.add(title);
        }
        setMobileExpandedItems(newExpanded);
    };

    // Handle touch gestures for mobile menu
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchEnd - touchStart;
        const isRightSwipe = distance > 50;
        
        if (isRightSwipe && mobileMenuOpen) {
            closeMobileMenu();
        }
        
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Close dropdown when clicking outside and handle keyboard events
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Close dropdown
            if (!target.closest('.navbar-dropdown')) {
                setActiveDropdown(null);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
                closeMobileMenu();
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Clean up body scroll if menu is open
            if (mobileMenuOpen) {
                closeMobileMenu();
            }
        };
    }, [mobileMenuOpen]);

    // Check if any sub-item is active
    const isParentActive = (items?: MenuItemType[]): boolean => {
        if (!items) return false;
        return items.some(item => {
            if (pathname === item.path) return true;
            if (item.path !== '/' && pathname.startsWith(item.path)) return true;
            return false;
        });
    }

    // Check if current menu item is active
    const isItemActive = (item: MenuType): boolean => {
        if (item.path) {
            if (item.path === '/' && pathname === '/') return true;
            if (item.path !== '/' && pathname === item.path) return true;
            if (item.path !== '/' && pathname.startsWith(item.path)) return true;
            return false;
        }
        return isParentActive(item.items);
    }

    return (
        <nav className="relative">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center w-full">
                {/* Main Navigation Links */}
                <ul className="flex items-center space-x-1 justify-center h-12 min-h-[48px]">
                    {currentMenu?.map((item, index) => {
                        const hasDropdown = item?.items && item?.items?.length > 0;
                        const isActive = isItemActive(item);
                        
                        return (
                            <li 
                                key={index} 
                                className="relative navbar-dropdown flex items-center h-full"
                                onMouseEnter={() => hasDropdown && handleMouseEnter(index)}
                                onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                            >
                                {hasDropdown ? (
                                    <DropdownMenuItem 
                                        item={item} 
                                        index={index}
                                        isActive={isActive}
                                        activeDropdown={activeDropdown}
                                        pathname={pathname}
                                    />
                                ) : (
                                    <SimpleMenuItem 
                                        item={item} 
                                        isActive={isActive}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                {/* Mobile Menu Button - Enhanced */}
                <button
                    ref={hamburgerRef}
                    onClick={toggleMobileMenu}
                    className="relative p-2 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md group"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu-panel"
                >
                    <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                        {/* Animated Hamburger Lines */}
                        <span className={`
                            absolute w-4 h-0.5 bg-gray-700 transition-all duration-300 ease-out transform
                            ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'}
                            group-hover:bg-orange-600
                        `}></span>
                        <span className={`
                            absolute w-4 h-0.5 bg-gray-700 transition-all duration-300 ease-out
                            ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                            group-hover:bg-orange-600
                        `}></span>
                        <span className={`
                            absolute w-4 h-0.5 bg-gray-700 transition-all duration-300 ease-out transform
                            ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'}
                            group-hover:bg-orange-600
                        `}></span>
                    </div>
                </button>

                {/* Mobile Menu Overlay - Enhanced */}
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in"
                        onClick={closeMobileMenu}
                        style={{ 
                            animation: 'fadeIn 0.3s ease-out',
                            willChange: 'opacity'
                        }}
                        aria-hidden="true"
                    />
                )}

                {/* Mobile Menu Panel - Enhanced */}
                <div 
                    id="mobile-menu-panel"
                    ref={mobileMenuRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`
                        fixed top-0 left-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-[9999] transform transition-all duration-300 ease-out flex flex-col
                        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                        border-r border-gray-100
                    `}
                    style={{ 
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        pointerEvents: mobileMenuOpen ? 'auto' : 'none'
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation menu"
                >
                    {/* Mobile Menu Header - Enhanced */}
                    <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 p-6 text-white relative overflow-hidden flex-shrink-0">
                        {/* Decorative Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                        </div>
                        
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Menu</h2>
                                <p className="text-orange-100 text-sm">Navigate through our site</p>
                            </div>
                            <button
                                data-mobile-close
                                onClick={closeMobileMenu}
                                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close mobile menu"
                            >
                                <FaTimes size={18} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Content - Enhanced */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                        <div className="p-4 space-y-1">
                            {currentMenu?.map((item, index) => {
                                const hasDropdown = item?.items && item?.items?.length > 0;
                                const isActive = isItemActive(item);
                                const isExpanded = mobileExpandedItems.has(item.title);
                                
                                return (
                                    <div key={index} className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-sm transition-all duration-200">
                                        {hasDropdown ? (
                                            <MobileDropdownItem
                                                item={item}
                                                isActive={isActive}
                                                isExpanded={isExpanded}
                                                onToggleExpanded={() => toggleMobileExpanded(item.title)}
                                                onClose={closeMobileMenu}
                                                pathname={pathname}
                                            />
                                        ) : (
                                            <MobileSimpleItem
                                                item={item}
                                                isActive={isActive}
                                                onClose={closeMobileMenu}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Section - Fixed at bottom */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50">
                        {/* Mobile SignIn/SignOut Buttons */}
                        <div className="mb-4 flex flex-col gap-2">
                            <Link href={`/SignIn?redirectUrl=${encodeURIComponent(pathname)}`}>
                                <button 
                                    onClick={closeMobileMenu}
                                    className="w-full bg-orange-600 text-white font-medium rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-orange-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Sign In
                                </button>
                            </Link>
                            <Link href="/Registration-Form">
                                <button 
                                    onClick={closeMobileMenu}
                                    className="w-full bg-white text-orange-600 border border-orange-600 font-medium rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                >
                                    Register
                                </button>
                            </Link>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500">
                            <p>© 2025 IHU USA</p>
                            <p className="mt-1">Traditional Hindu University</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

// ================== DESKTOP MENU COMPONENTS ==================

// Simple Menu Item Component
const SimpleMenuItem = ({ 
    item, 
    isActive 
}: { 
    item: MenuType; 
    isActive: boolean;
}) => (
    <HeaderLink
        href={item.path as string}
        className={`
            relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 h-full flex items-center justify-center min-h-[40px] leading-none align-baseline whitespace-nowrap
            ${isActive 
                ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                : 'text-gray-700'
            }
        `}
    >
        <span className="inline-block">{item.title}</span>
        {isActive && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
        )}
    </HeaderLink>
);

// Dropdown Menu Item Component
const DropdownMenuItem = ({ 
    item, 
    index,
    isActive,
    activeDropdown,
    pathname
}: { 
    item: MenuType; 
    index: number;
    isActive: boolean;
    activeDropdown: number | null;
    pathname: string;
}) => (
    <>
        {/* Dropdown Trigger */}
        {item.path ? (
            <HeaderLink
                href={item.path}
                className={`
                    relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 h-full justify-center min-h-[40px] leading-none align-baseline whitespace-nowrap
                    ${isActive 
                        ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                        : 'text-gray-700'
                    }
                `}
            >
                <span className="inline-block">{item.title}</span>
                <FaChevronDown 
                    className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                    }`}
                />
                {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
                )}
            </HeaderLink>
        ) : (
            <button
                className={`
                    relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-all duration-200 h-full justify-center min-h-[40px] leading-none align-baseline whitespace-nowrap
                    ${isActive 
                        ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 shadow-sm' 
                        : 'text-gray-700'
                    }
                `}
            >
                <span className="inline-block">{item.title}</span>
                <FaChevronDown 
                    className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                    }`}
                />
                {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
                )}
            </button>
        )}

        {/* Dropdown Menu */}
        {activeDropdown === index && item.items && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="py-2">
                    {item.items.map((subItem, subIndex) => {
                        const isSubActive = pathname === subItem.path;
                        return (
                            <HeaderLink
                                key={subIndex}
                                href={subItem.path}
                                className={`
                                    block px-4 py-3 text-sm transition-all duration-150 relative
                                    ${isSubActive 
                                        ? 'text-orange-600 bg-orange-50 font-medium border-r-2 border-orange-500' 
                                        : 'text-gray-700'
                                    }
                                `}
                            >
                                {subItem.title}
                                {isSubActive && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
                                )}
                            </HeaderLink>
                        );
                    })}
                </div>
            </div>
        )}
    </>
);

// ================== MOBILE MENU COMPONENTS ==================

// Mobile Simple Item Component
const MobileSimpleItem = ({ 
    item, 
    isActive,
    onClose
}: { 
    item: MenuType; 
    isActive: boolean;
    onClose: () => void;
}) => (
    <HeaderLink
        href={item.path as string}
        onClick={onClose}
        className={`
            block w-full text-left px-5 py-4 text-base font-medium rounded-xl transition-all duration-300
            relative overflow-hidden group mobile-menu-item-hover mobile-touch-feedback
            ${isActive 
                ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 mobile-menu-active' 
                : 'text-gray-700 hover:text-orange-600'
            }
        `}
    >
        <span className="relative z-10 flex items-center">
            {item.title}
            {isActive && (
                <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            )}
        </span>
    </HeaderLink>
);

// Mobile Dropdown Item Component
const MobileDropdownItem = ({ 
    item, 
    isActive,
    isExpanded,
    onToggleExpanded,
    onClose,
    pathname
}: { 
    item: MenuType; 
    isActive: boolean;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onClose: () => void;
    pathname: string;
}) => (
    <div className="overflow-hidden">
        {/* Mobile Dropdown Trigger */}
        <div className="flex items-center justify-between">
            {item.path ? (
                <HeaderLink
                    href={item.path}
                    className={`
                        flex-1 text-left px-5 py-4 text-base font-medium rounded-xl transition-all duration-300
                        relative overflow-hidden group mobile-menu-item-hover mobile-touch-feedback
                        ${isActive 
                            ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 mobile-menu-active' 
                            : 'text-gray-700 hover:text-orange-600'
                        }
                    `}
                >
                    <span className="relative z-10 flex items-center">
                        {item.title}
                        {isActive && (
                            <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        )}
                    </span>
                </HeaderLink>
            ) : (
                <div className={`
                    flex-1 px-5 py-4 text-base font-medium rounded-xl mobile-menu-item-hover
                    ${isActive 
                        ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 mobile-menu-active' 
                        : 'text-gray-700'
                    }
                `}>
                    <span className="flex items-center">
                        {item.title}
                        {isActive && (
                            <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        )}
                    </span>
                </div>
            )}
            
            <button
                onClick={onToggleExpanded}
                className="p-4 rounded-xl transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 group"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.title} submenu`}
            >
                <FaChevronDown 
                    size={16} 
                    className={`
                        text-gray-400 transition-all duration-300 ease-out group-hover:text-orange-600
                        ${isExpanded ? 'rotate-180 text-orange-600' : ''}
                    `}
                />
            </button>
        </div>

        {/* Mobile Dropdown Content - Enhanced */}
        <div className={`
            overflow-hidden transition-all duration-500 ease-out mobile-dropdown-content
            ${isExpanded ? 'max-h-96 opacity-100 expanded' : 'max-h-0 opacity-0'}
        `}>
            {item.items && (
                <div className="ml-4 mb-3 space-y-1 border-l-2 border-orange-200 pl-4 bg-orange-25 rounded-r-xl py-2">
                    {item.items.map((subItem, subIndex) => {
                        const isSubActive = pathname === subItem.path;
                        return (
                            <HeaderLink
                                key={subIndex}
                                href={subItem.path}
                                onClick={onClose}
                                className={`
                                    block px-4 py-3 text-sm rounded-lg transition-all duration-300
                                    relative overflow-hidden group mobile-menu-item-hover mobile-touch-feedback
                                    ${isSubActive 
                                        ? 'text-orange-600 bg-orange-100 font-medium mobile-menu-active' 
                                        : 'text-gray-600 hover:text-orange-600'
                                    }
                                `}
                            >
                                <span className="relative z-10 flex items-center">
                                    {subItem.title}
                                    {isSubActive && (
                                        <div className="ml-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                                    )}
                                </span>
                            </HeaderLink>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
);

export default Navbar;