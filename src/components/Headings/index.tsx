import React from 'react';
import clsx from 'clsx';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

export const H1: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h1 className={clsx("text-4xl md:text-5xl font-bold", className)} {...props}>{children}</h1>
);

export const H2: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h2 className={clsx("text-3xl md:text-4xl font-semibold", className)} {...props}>{children}</h2>
);

export const H3: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h3 className={clsx("text-2xl md:text-3xl font-medium", className)} {...props}>{children}</h3>
);

export const H4: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h4 className={clsx("text-xl md:text-2xl", className)} {...props}>{children}</h4>
);

export const H5: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h5 className={clsx("text-lg md:text-xl", className)} {...props}>{children}</h5>
);

export const H6: React.FC<HeadingProps> = ({ children, className, ...props }) => (
    <h6 className={clsx("text-md md:text-lg font-normal", className)} {...props}>{children}</h6>
);