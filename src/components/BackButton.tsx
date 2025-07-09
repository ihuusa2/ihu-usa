'use client'

const BackButton = ({ label = 'Go Back', className }: { label?: string; className?: string }) => {
    return (
        <button 
            className={`inline-flex items-center gap-2 px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors duration-200 font-medium ${className || ''}`}
            onClick={() => window.history.back()}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
            >
                <path d="M19 12H5" />
                <path d="M12 19 5 12 12 5" />
            </svg>
            <span>{label}</span>
        </button>
    )
}

export default BackButton 
