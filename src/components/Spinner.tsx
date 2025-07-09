import React from "react";

interface SpinnerProps {
    size?: string; // Size of the spinner (default: 6rem)
    color?: string; // Tailwind color class (default: 'text-blue-500')
}

const Spinner: React.FC<SpinnerProps> = ({ size = "2rem", color = "text-blue-500" }) => {
    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-4 border-solid border-gray-200 ${color}`}
                style={{
                    width: size,
                    height: size,
                    borderTopColor: "currentColor",
                }}
            ></div>
        </div>
    );
};

export default Spinner;
