import React from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    size?: ContainerSize;
    padding?: ContainerPadding;
    className?: string;
    fluid?: boolean;
    centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
    children,
    size = 'lg',
    padding = 'md',
    className = '',
    fluid = false,
    centered = true,
    ...props
}) => {
    const sizeClasses = {
        sm: 'max-w-3xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        full: 'max-w-full'
    };

    const paddingClasses = {
        none: 'px-0',
        sm: 'px-3 sm:px-4',
        md: 'px-4 sm:px-6 lg:px-8',
        lg: 'px-6 sm:px-8 lg:px-12',
        xl: 'px-8 sm:px-12 lg:px-16'
    };

    const baseClasses = [
        'w-full',
        !fluid && sizeClasses[size],
        centered && !fluid && 'mx-auto',
        paddingClasses[padding],
        'relative'
    ].filter(Boolean).join(' ');

    const combinedClasses = `${baseClasses} ${className}`.trim();

    return (
        <div 
            className={combinedClasses}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container;