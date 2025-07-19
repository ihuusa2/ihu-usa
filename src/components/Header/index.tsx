'use client'

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import SignInButton from "./SignInButton";
import ProfileDropdown from "./ProfileDropdown";
import { Session } from "next-auth";

// Components
import Container from "../Container";
import Navbar from "./Navbar";
import NavbarSkeleton from "./NavbarSkeleton";
import Search from "./Search";
import AcademicCalendar from "../AcademicCalendar";

// Server Functions
import { getSettings } from "@/Server/Settings";
import { getAllCourseTypes } from "@/Server/CourseType";
import { getAllTeamTypes } from "@/Server/TeamType";
import { getUserById, getUserByRegistrationNumber } from "@/Server/User";
import { useSession } from "next-auth/react";

// Icons
import { 
    FaFacebook, 
    FaYoutube, 
    FaTwitter,
    FaCalendarAlt
} from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

// Utils
import { User, UserRole } from "@/Types/User";

// ================== TYPE DEFINITIONS ==================

interface SiteType {
    logo: string;
    phone: string;
    email: string;
    social: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
        twitter?: string;
    };
}

interface SocialLinkType {
    title: string;
    path: string;
    logo: React.ReactNode;
}

interface MenuItemType {
    title: string;
    path: string;
}

interface MenuType {
    title: string;
    items?: MenuItemType[];
    path?: string;
}

export const Header = () => {
    const { data: session } = useSession();
    const [site, setSite] = useState<SiteType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [teamCategory, setTeamCategory] = useState<{ list?: Array<{ title: string }> } | null>(null);
    const [courseCategory, setCourseCategory] = useState<{ list?: Array<{ title: string }> } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch site settings
                const siteData = await getSettings();
                setSite({
                    logo: typeof siteData?.logo === 'string' ? siteData.logo : '',
                    phone: siteData?.phone || '',
                    email: siteData?.email || '',
                    social: siteData?.social || {}
                });

                // Fetch user data if session exists
                if (session?.user?.id) {
                    // Check if the ID is a valid ObjectId (for admin users) or registration number (for students)
                    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
                    
                    let userData;
                    if (isValidObjectId) {
                        // Admin user - use ObjectId
                        userData = await getUserById(session.user.id);
                    } else {
                        // Student user - use registration number
                        userData = await getUserByRegistrationNumber(session.user.id);
                    }
                    
                    setUser(userData);
                }

                // Fetch dynamic menu data
                const [teamData, courseData] = await Promise.all([
                    getAllTeamTypes({}),
                    getAllCourseTypes({})
                ]);
                
                setTeamCategory(teamData);
                setCourseCategory(courseData);
            } catch (error) {
                console.error('Error fetching header data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.id]);

    // Show loading state while fetching data
    if (loading) {
        return <NavbarSkeleton />;
    }

    // Social Links Configuration
    const socialLinks = [
        { 
            title: "facebook", 
            path: "https://facebook.com", 
            logo: <FaFacebook size={16} /> 
        },
        { 
            title: "instagram", 
            path: "https://instagram.com", 
            logo: <AiFillInstagram size={18} /> 
        },
        { 
            title: "youtube", 
            path: "https://youtube.com", 
            logo: <FaYoutube size={18} /> 
        },
        { 
            title: "twitter", 
            path: "https://twitter.com", 
            logo: <FaTwitter size={16} /> 
        }
    ];

    // Main Navigation Menu
    const menu: { title: string; items?: { title: string; path: string }[]; path?: string }[] = [
        {
            title: "Home",
            path: "/",
        },
        {
            title: "About",
            path: "/About",
            items: [
                { title: "History", path: "/About" },
                { title: "Mission & Vision", path: "/Mission-vision" },
                { title: "Values & Spirit", path: "/Value-spirit" },
                { title: "IHU Anthem (Kulgeet)", path: "/Kulgeet" },
            ],
        },
        {
            title: "Our Team",
            items: (() => {
                if (teamCategory?.list && teamCategory.list.length > 0) {
                    // Create the dynamic menu items
                    const dynamicItems = teamCategory.list.map((item: { title: string }) => ({ 
                        title: item.title, 
                        path: `/Team/${item.title?.replace(/\s+/g, '-')}` 
                    }));
                    
                    // Check if "Board of Trustees" already exists in the dynamic list
                    const hasBoardOfTrustees = dynamicItems.some(item => 
                        item.title.toLowerCase().includes('board of trustees') || 
                        item.title.toLowerCase().includes('trustees')
                    );
                    
                    // If "Board of Trustees" doesn't exist, add it at the top
                    if (!hasBoardOfTrustees) {
                        return [
                            { title: "Board of Trustees", path: "/Team/Board-of-Trustees" },
                            ...dynamicItems
                        ];
                    }
                    
                    // If it exists, reorder to put it at the top
                    const boardOfTrustees = dynamicItems.find(item => 
                        item.title.toLowerCase().includes('board of trustees') || 
                        item.title.toLowerCase().includes('trustees')
                    );
                    const otherItems = dynamicItems.filter(item => 
                        !item.title.toLowerCase().includes('board of trustees') && 
                        !item.title.toLowerCase().includes('trustees')
                    );
                    
                    return boardOfTrustees ? [boardOfTrustees, ...otherItems] : dynamicItems;
                } else {
                    // Fallback menu
                    return [
                        { title: "Board of Trustees", path: "/Team/Board-of-Trustees" },
                        { title: "Executive Team", path: "/Team/Executive-Team" },
                        { title: "Faculty", path: "/Team/Faculty" },
                        { title: "Advisory Board", path: "/Team/Advisory-Board" }
                    ];
                }
            })()
        },
        {
            title: "Courses",
            items: (courseCategory?.list && courseCategory.list.length > 0) ? courseCategory.list.map((item: { title: string }) => ({ 
                title: item.title, 
                path: `/Courses/${item.title?.replace(/\s+/g, '-')}` 
            })) : [
                { title: "Undergraduate", path: "/Courses/Undergraduate" },
                { title: "Postgraduate", path: "/Courses/Postgraduate" },
                { title: "Diploma", path: "/Courses/Diploma" },
                { title: "Certificate", path: "/Courses/Certificate" }
            ]
        },
        {
            title: "Admissions",
            items: [
                { title: "Registration Form", path: "/Registration-Form" },
                { title: "Course Selection Form", path: "/Course-Selection-Form" },
            ],
        },
        {
            title: "Media",
            items: [
                { title: "Photo Gallery", path: "/Photo-Gallery" },
                { title: "Video Gallery", path: "/Video-Gallery" },
                { title: "Events", path: "/Events" },
                { title: "Webinars", path: "/Webinars" },
                { title: "FAQ's", path: "/FAQ" },
            ],
        },
        {
            title: "Contact",
            path: "/Contact",
        },
        {
            title: "Blogs",
            path: "/Blogs",
        },
    ];

    // Add dynamic menu items based on session
    // Profile is now handled in the dropdown, so we don't add it to the main menu

    // Show Student Panel only for students (User role)
    if (session?.user && user && user.role === UserRole.User) {
        menu.push({
            title: "Student Panel",
            items: [
                { title: "Applied Courses", path: "/Student-Panel" },
            ]
        });
    }

    // Admin Navigation Menu
    const AdminMenu = [
        {
            title: "Admin",
            path: "/admin",
        },
        {
            title: "Admissions",
            items: [
                { title: "Registrations", path: "/admin/Registrations" },
                { title: "Course Selections", path: "/admin/Course-Selections" },
            ],
        },
        {
            title: "Media",
            items: [
                { title: "Photo Gallery", path: "/admin/Photo-Gallery" },
                { title: "Video Gallery", path: "/admin/Video-Gallery" },
                { title: "Events", path: "/admin/Events" },
                { title: "Webinars", path: "/admin/Webinars" },
                { title: "FAQ's", path: "/admin/FAQ" },
            ],
        },
        {
            title: "Users",
            path: "/admin/Users",
        },
        {
            title: "Our Team",
            items: [
                { title: "Team", path: "/admin/Team" },
                { title: "Team Type", path: "/admin/Team/TeamType" }
            ]
        },
        {
            title: "Courses",
            items: [
                { title: "Courses", path: "/admin/Courses" },
                { title: "Course Type", path: "/admin/Courses/CourseType" },
            ],
        },
        {
            title: "Contact",
            path: "/admin/Contact",
        },
        {
            title: "Blogs",
            path: "/admin/Blogs",
        },
        {
            title: "Site Settings",
            path: "/admin/Settings",
        },
        {
            title: "Other Forms",
            items: [
                { title: "Donations", path: "/admin/Donations" },
                { title: "Volunteers", path: "/admin/Volunteer" }
            ],
        },
    ];

        return (
        <header className="bg-white shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-[99999]">
                    {/* Top Contact Bar */}
        <TopContactBar 
            site={site || { logo: '', phone: '', email: '', social: {} }}
            socialLinks={socialLinks}
            session={session}
            user={user}
            setIsCalendarOpen={setIsCalendarOpen}
        />
            
                    {/* Main Header */}
        <MainHeader 
            site={site || { logo: '', phone: '', email: '', social: {} }}
            menu={menu}
            AdminMenu={AdminMenu}
            setIsCalendarOpen={setIsCalendarOpen}
        />
        
        {/* Mobile Search Bar */}
        <MobileSearchBar />
        
        {/* Academic Calendar Modal */}
        <AcademicCalendar 
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
        />
    </header>
);
};

// ================== HELPER COMPONENTS ==================

// Top Contact Bar Component
const TopContactBar = ({ 
    site, 
    socialLinks,
    session,
    user,
    setIsCalendarOpen
}: { 
    site: SiteType; 
    socialLinks: SocialLinkType[];
    session: Session | null;
    user: User | null;
    setIsCalendarOpen: (open: boolean) => void;
}) => (
    <div className="bg-[#333] text-white py-1 sm:py-2 w-full">
        <Container className="flex items-center justify-between gap-4 w-full">
            {/* Left: Social Media Icons */}
            <div className="flex items-center gap-2">
                {socialLinks
                    .filter(link => site?.social?.[link.title as keyof typeof site.social]?.trim())
                    .map((link, index) => {
                        const siteLink = site?.social?.[link.title as keyof typeof site.social];
                        return (
                            <Link 
                                key={index} 
                                href={siteLink as string} 
                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.logo}
                            </Link>
                        );
                    })
                }
            </div>
            
            {/* Center: Search Bar */}
            <div className="flex-1 flex items-center justify-center max-w-md">
                <div className="hidden sm:block w-full">
                    <TopSearchBar />
                </div>
            </div>
            
            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Academic Calendar Button */}
                <button
                    onClick={() => setIsCalendarOpen(true)}
                    className="p-2 text-white hover:text-orange-400 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                    title="Academic Calendar"
                >
                    <FaCalendarAlt className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
                <Link href="/Registration-Form">
                    <button className="bg-white text-black font-medium rounded-md px-3 sm:px-5 py-2 text-sm sm:text-base shadow-none cursor-pointer hover:bg-gray-100 transition-colors duration-200">Apply</button>
                </Link>
                <Link href="/Donate">
                    <button className="hidden sm:block bg-white text-black font-medium rounded-md px-5 py-2 text-base shadow-none cursor-pointer hover:bg-gray-100 transition-colors duration-200">Donate</button>
                </Link>
                {session?.user && user ? (
                    <ProfileDropdown user={user} />
                ) : (
                    <SignInButton />
                )}
            </div>
        </Container>
    </div>
);

// Main Header Component
const MainHeader = ({ 
    site, 
    menu, 
    AdminMenu,
    setIsCalendarOpen
}: { 
    site: SiteType; 
    menu: MenuType[]; 
    AdminMenu: MenuType[];
    setIsCalendarOpen?: (open: boolean) => void;
}) => (
    <div className="bg-white py-1 sm:py-2">
        <Container className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile Layout: Hamburger on left, Logo center */}
            <div className="lg:hidden flex items-center justify-between w-full">
                {/* Left: Mobile Navigation */}
                <div className="flex-shrink-0">
                    <MobileNavSection 
                        menu={menu}
                        AdminMenu={AdminMenu}
                        setIsCalendarOpen={setIsCalendarOpen}
                    />
                </div>
                {/* Center: Logo */}
                <div className="flex-1 flex items-center justify-center">
                    <LogoSection site={site} />
                </div>
                {/* Right: Empty space for balance */}
                <div className="flex-shrink-0 w-12"></div>
            </div>
            
            {/* Desktop Layout: Logo on left, Navigation center */}
            <div className="hidden lg:flex items-center justify-between w-full">
                {/* Left Section - Logo */}
                <div className="flex-shrink-0">
                    <LeftSection 
                        site={site}
                    />
                </div>
                {/* Center Section - Navigation */}
                <div className="flex-1 flex items-center justify-center">
                    <CenterSection 
                        menu={menu}
                        AdminMenu={AdminMenu}
                        setIsCalendarOpen={setIsCalendarOpen}
                    />
                </div>
            </div>
        </Container>
    </div>
);

// Left Section Component
const LeftSection = ({ 
    site
}: { 
    site: SiteType; 
}) => (
    <div className="flex items-center gap-2 sm:gap-4">
        <LogoSection site={site} />
    </div>
);

// Logo Section Component
const LogoSection = ({ site }: { site: SiteType }) => (
    <Link href="/" className="flex items-center gap-2 sm:gap-4 group">
        <div className="relative">
            <Image
                width={220}
                height={220}
                src={site?.logo as string}
                alt="IHU International Hindu University"
                className="w-32 sm:w-40 md:w-48 lg:w-56 transition-transform duration-200 group-hover:scale-105"
                priority
            />
        </div>
    </Link>
);

// Mobile Navigation Section Component
const MobileNavSection = ({ 
    menu, 
    AdminMenu,
    setIsCalendarOpen
}: { 
    menu: MenuType[]; 
    AdminMenu: MenuType[];
    setIsCalendarOpen?: (open: boolean) => void;
}) => (
    <div className="flex items-center">
        <Navbar
            menu={menu}
            AdminMenu={AdminMenu}
            setIsCalendarOpen={setIsCalendarOpen}
        />
    </div>
);

// Center Section Component
const CenterSection = ({ 
    menu, 
    AdminMenu,
    setIsCalendarOpen
}: { 
    menu: MenuType[]; 
    AdminMenu: MenuType[];
    setIsCalendarOpen?: (open: boolean) => void;
}) => (
    <div className="w-full max-w-4xl flex items-center justify-center">
        <Navbar
            menu={menu}
            AdminMenu={AdminMenu}
            setIsCalendarOpen={setIsCalendarOpen}
        />
    </div>
);

// Top Search Bar Component (for contact bar)
const TopSearchBar = () => {
    const pathName = usePathname()
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const searchQuery = formData.get('search')?.toString()
        
        if (searchQuery && searchQuery.trim()) {
            // Determine the appropriate search parameter based on current page
            let searchParam = 'search'
            if (pathName.includes('/Blogs')) searchParam = 'title'
            else if (pathName.includes('/Team')) searchParam = 'name'
            else if (pathName.includes('/Courses')) searchParam = 'title'
            else if (pathName.includes('/Events')) searchParam = 'title'
            else if (pathName.includes('/admin/Registrations')) searchParam = 'firstName'
            else if (pathName.includes('/admin/Course-Selections')) searchParam = 'registrationNumber'
            
            router.push(`${pathName}?${searchParam}=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-center w-full bg-white rounded-md overflow-hidden shadow-none"
        >
            <input
                type="text"
                name="search"
                placeholder="Search..."
                className="flex-1 px-3 py-2 text-black bg-white border-none outline-none text-sm"
            />
            <button 
                type="submit" 
                className="px-4 py-2 bg-white text-black font-medium rounded-none hover:bg-gray-50 transition-colors duration-200"
            >
                Search
            </button>
        </form>
    )
}

// Mobile Search Bar Component
const MobileSearchBar = () => (
    <div className="sm:hidden bg-gradient-to-r from-gray-50 to-gray-100 py-2 border-t border-gray-200 relative z-15">
        <Container>
            <div className="max-w-sm mx-auto">
                <Search />
            </div>
        </Container>
    </div>
);
