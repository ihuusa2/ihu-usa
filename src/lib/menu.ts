export const menu: { title: string; items?: { title: string; path: string }[]; path?: string }[] = [
    {
        title: "Home",
        path: "/",
    },
    {
        title: "About",
        items: [
            { title: "History", path: "/About" },
            { title: "Mission & Vision", path: "/Mission-vision" },
            { title: "Values & Spirit", path: "/Value-spirit" },
            { title: "IHU Anthem (Kulgeet)", path: "/Kulgeet" },
        ],
    },
    {
        title: "Our Team",
        items: [
            { title: "Board Of Trustees", path: "/Team/Board-of-trustees" },
            { title: "Board Of Directors", path: "/Team/Board-of-directors" },
            { title: "Academic Council", path: "/Team/Academic-council" },
            { title: "Faculty", path: "/Team/Faculty" },
            { title: "Spiritual Advisory", path: "/Team/Spiritual-advisory" },
            { title: "Administration", path: "/Team/administration" },
        ],
    },
    {
        title: "Courses",
        items: [
            { title: "Degree", path: "/Courses/Degree" },
            { title: "Certification", path: "/Courses/Certification" },
            { title: "PhD", path: "/Courses/PhD" },
        ],
    },
    {
        title: "Admissions",
        items: [
            { title: "Registration Form", path: "/Applications/Registration-Form" },
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
    }
]

export const AdminMenu = [
    {
        title: "Home",
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
        title: "Team",
        path: "/admin/Team",
    },
    {
        title: "Courses",
        items: [
            {
                title: "Courses",
                path: "/admin/Courses",
            },
            {
                title: "Course Type",
                path: "/admin/Courses/CourseType",
            },
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
            {
                title: "Donations",
                path: "/admin/Donations",
            },
            {
                title: "Volunteers",
                path: "/admin/Volunteer",
            }
        ],
    },
]