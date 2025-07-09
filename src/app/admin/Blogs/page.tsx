'use client'

import type { Blog } from "@/Types/Blogs";
import { H1 } from '@/components/Headings/index'
import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Spinner'
import { deleteBlog, getAllBlogs, fixBlogsWithoutSlugs, fixBlogsWithInvalidImages, getBlogImagesSummary } from '@/Server/Blogs'
import Pagination from '@/components/Pagination'
import { useSearchParams } from 'next/navigation'
import Image from "next/image";
import AddBlog from "../components/AddBlog";
import { Search, Eye, Edit, Trash2, Plus, FileText, Image as ImageIcon, User, X } from "lucide-react";

// Utility function to validate and get image URL
const getImageUrl = (image: File | string | undefined): string => {
    if (!image) {
        console.log('No image provided, using default');
        return '/Images/Programs/image1.png';
    }
    
    if (typeof image === 'string') {
        const trimmed = image.trim();
        if (trimmed === '') {
            console.log('Empty image string, using default');
            return '/Images/Programs/image1.png';
        }
        
        // Check if it's a valid URL or relative path
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
            console.log('Using image URL:', trimmed);
            return trimmed;
        }
        
        // If it's a Cloudinary URL (common case for uploaded images)
        if (trimmed.includes('cloudinary.com')) {
            console.log('Using Cloudinary URL:', trimmed);
            return trimmed;
        }
        
        // If it's just a filename, assume it's in the public folder
        const publicPath = `/${trimmed}`;
        console.log('Using public path:', publicPath);
        return publicPath;
    }
    
    // If it's a File object, we can't display it directly in this context
    console.log('File object detected, using default image');
    return '/Images/Programs/image1.png';
};

// Custom Modal Component
const Modal = ({ isOpen, onClose, children, title, size = "md" }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "4xl": "max-w-4xl"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-xl w-full mx-4 ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
                
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Custom Button Component
const Button = ({ 
    children, 
    onClick, 
    disabled = false, 
    variant = "primary", 
    size = "md",
    className = "",
    type = "button"
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    className?: string;
    type?: "button" | "submit" | "reset";
}) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };
    
    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm gap-1",
        md: "px-4 py-2 text-sm gap-2",
        lg: "px-6 py-3 text-base gap-2"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {children}
        </button>
    );
};

// Custom Input Component
const Input = ({ 
    placeholder, 
    value, 
    onChange, 
    className = "",
    type = "text"
}: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string;
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
    );
};

// Custom Table Component
const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full">
                {children}
            </table>
        </div>
    );
};

const TableHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <thead className={`bg-gray-50 ${className}`}>
            {children}
        </thead>
    );
};

const TableBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <tbody className={`divide-y divide-gray-200 ${className}`}>
            {children}
        </tbody>
    );
};

const TableRow = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
    return (
        <tr 
            className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <td className={`px-6 py-4 ${className}`}>
            {children}
        </td>
    );
};

const TableHeaderCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
            {children}
        </th>
    );
};

const AdminBlogs = () => {
    const searchParams = useSearchParams()
    const [data, setData] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [fixingSlugs, setFixingSlugs] = useState(false)
    const [fixMessage, setFixMessage] = useState('')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null)
    const [selectedContent, setSelectedContent] = useState<string | null>(null)
    const [imageSummary, setImageSummary] = useState<{ title: string; image: string; isValid: boolean }[]>([])
    const [showImageSummary, setShowImageSummary] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const params: { [key: string]: string | string[] | undefined } = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });
            await getAllBlogs({ searchParams: params }).then((blogs) => {
                if (blogs && blogs?.list?.length > 0) {
                    console.log('Received blogs data:', blogs.list);
                    console.log('First blog sample:', blogs.list[0]);
                    setData(blogs.list)
                    setCount(blogs.count)
                } else {
                    console.log('No blogs data received or empty list');
                }
            }).finally(() => {
                setLoading(false)
            })
        })()
    }, [searchParams])

    // Fix blogs without slugs
    const handleFixSlugs = async () => {
        setFixingSlugs(true)
        setFixMessage('')
        
        try {
            const result = await fixBlogsWithoutSlugs()
            if (result.updated > 0) {
                setFixMessage(`✅ Successfully fixed ${result.updated} blog(s) without slugs!`)
                // Refresh the data
                const params: { [key: string]: string | string[] | undefined } = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                const updatedBlogs = await getAllBlogs({ searchParams: params })
                if (updatedBlogs?.list) {
                    setData(updatedBlogs.list)
                    setCount(updatedBlogs.count)
                }
            } else {
                setFixMessage('ℹ️ All blogs already have slugs!')
            }
        } catch {
            setFixMessage('❌ Error fixing slugs. Please try again.')
        } finally {
            setFixingSlugs(false)
            // Clear message after 5 seconds
            setTimeout(() => setFixMessage(''), 5000)
        }
    }

    const handleFixImages = async () => {
        setFixingSlugs(true)
        setFixMessage('')
        
        try {
            const result = await fixBlogsWithInvalidImages()
            if (result.updated > 0) {
                setFixMessage(`✅ Successfully fixed ${result.updated} blog(s) with invalid images!`)
                // Refresh the data
                const params: { [key: string]: string | string[] | undefined } = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });
                const updatedBlogs = await getAllBlogs({ searchParams: params })
                if (updatedBlogs?.list) {
                    setData(updatedBlogs.list)
                    setCount(updatedBlogs.count)
                }
            } else {
                setFixMessage('ℹ️ All blog images are already valid!')
            }
        } catch {
            setFixMessage('❌ Error fixing images. Please try again.')
        } finally {
            setFixingSlugs(false)
            // Clear message after 5 seconds
            setTimeout(() => setFixMessage(''), 5000)
        }
    }

    const handleCheckImages = async () => {
        try {
            const summary = await getBlogImagesSummary()
            setImageSummary(summary)
            setShowImageSummary(true)
        } catch (error) {
            console.error('Error checking images:', error)
        }
    }

    // Filter data based on search term
    const filteredData = data.filter(blog => 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='w-full py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-none space-y-6'>
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                        <div className="space-y-1">
                            <H1 className="flex items-center gap-2">
                                <FileText className="text-blue-600" size={28} />
                                Blogs Management
                            </H1>
                            <p className="text-gray-600">Create and manage your blog content</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Button 
                                variant="outline"
                                onClick={handleFixSlugs}
                                disabled={fixingSlugs}
                                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                                {fixingSlugs ? <Spinner /> : <FileText size={16} />}
                                {fixingSlugs ? 'Fixing...' : 'Fix Slugs'}
                            </Button>
                            
                            <Button 
                                variant="outline"
                                onClick={handleFixImages}
                                disabled={fixingSlugs}
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                                {fixingSlugs ? <Spinner /> : <ImageIcon size={16} />}
                                {fixingSlugs ? 'Fixing...' : 'Fix Images'}
                            </Button>
                            
                            <Button 
                                variant="outline"
                                onClick={handleCheckImages}
                                className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                                <Eye size={16} />
                                Check Images
                            </Button>
                            
                            <Button 
                                variant="primary"
                                onClick={() => setOpen(true)}
                            >
                                <Plus size={16} />
                                Add New Blog
                            </Button>
                        </div>
                    </div>
                    
                                            {/* Fix Slugs Message */}
                        {fixMessage && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-blue-800">{fixMessage}</p>
                                </div>
                            </div>
                        )}
                </div>

                {/* Search and Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                placeholder="Search blogs by title, author, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Total: {count}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Showing: {filteredData.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableHeaderCell>
                                            <div className="flex items-center gap-2">
                                                <span>Preview</span>
                                                <div className="w-6 h-4 bg-blue-100 rounded border border-blue-300 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </TableHeaderCell>
                                        <TableHeaderCell>Blog Details</TableHeaderCell>
                                        <TableHeaderCell>Description</TableHeaderCell>
                                        <TableHeaderCell>Content</TableHeaderCell>
                                        <TableHeaderCell>Actions</TableHeaderCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((blog) => (
                                        <TableRow key={blog._id}>
                                            <TableCell>
                                                <div className="flex items-center justify-center min-h-[60px]">
                                                                                                        {(() => {
                                                        // Simple approach - always show something
                                                        const hasImage = blog.image && typeof blog.image === 'string' && blog.image.trim() !== '';
                                                        const imageUrl = hasImage ? getImageUrl(blog.image) : null;
                                                        
                                                        console.log(`Blog "${blog.title}":`, {
                                                            originalImage: blog.image,
                                                            hasImage,
                                                            imageUrl
                                                        });
                                                        
                                                        if (hasImage && imageUrl) {
                                                            return (
                                                                <div 
                                                                    className="relative cursor-pointer group"
                                                                    onClick={() => setSelectedImage(imageUrl)}
                                                                >
                                                                    <div className="w-[80px] h-[60px] rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors overflow-hidden bg-gray-50">
                                                                        <Image 
                                                                            src={imageUrl}
                                                                            alt={blog.title || 'Blog image'} 
                                                                            width={80}
                                                                            height={60}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                console.log('Image failed to load:', imageUrl);
                                                                                // Show placeholder on error
                                                                                const target = e.target as HTMLImageElement;
                                                                                target.style.display = 'none';
                                                                                const container = target.parentElement;
                                                                                if (container) {
                                                                                    container.innerHTML = `
                                                                                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                                                                            <div class="text-center">
                                                                                                <svg class="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                                                </svg>
                                                                                                <div class="text-xs text-gray-500">No Image</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    `;
                                                                                }
                                                                            }}
                                                                            onLoad={() => {
                                                                                console.log('Image loaded successfully:', imageUrl);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            // Show placeholder when no image
                                                            return (
                                                                <div className="w-[80px] h-[60px] rounded-lg border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                        <div className="text-xs text-gray-500">No Image</div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2 max-w-xs">
                                                    <div className="font-semibold text-gray-900 line-clamp-2">
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                                                        /{blog.slug}
                                                    </div>
                                                    {blog.author && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <User size={12} />
                                                            <span>{blog.author}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <div 
                                                        className="cursor-pointer group"
                                                        onClick={() => setSelectedDescription(blog.description || 'No description available')}
                                                    >
                                                        <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-blue-600 transition-colors">
                                                            {(blog.description || 'No description available').substring(0, 120)}
                                                            {(blog.description || '').length > 120 ? '...' : ''}
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto text-xs text-blue-600 hover:text-blue-800">
                                                            <Eye size={12} className="mr-1" />
                                                            Read more
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <div 
                                                        className="cursor-pointer group"
                                                        onClick={() => setSelectedContent(blog.content || 'No content available')}
                                                    >
                                                        <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                            {(blog.content || 'No content available').replace(/<[^>]*>/g, '').substring(0, 80)}
                                                            {(blog.content || '').replace(/<[^>]*>/g, '').length > 80 ? '...' : ''}
                                                        </p>
                                                        <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto text-xs text-blue-600 hover:text-blue-800">
                                                            <FileText size={12} className="mr-1" />
                                                            View content
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Action blog={blog} setData={setData} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
                            {filteredData.length === 0 && searchTerm && (
                                <div className="text-center py-12">
                                    <Search className="mx-auto text-gray-400 mb-4" size={48} />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                                    <p className="text-gray-600">Try adjusting your search criteria</p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4"
                                    >
                                        Clear search
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!searchTerm && <Pagination count={count} />}
            </div>

            {/* Modals */}
            <Modal 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                title="Add New Blog"
                size="4xl"
            >
                <div className="p-6">
                    <AddBlog setData={setData} setOpen={setOpen} />
                </div>
            </Modal>

            <Modal 
                isOpen={!!selectedImage} 
                onClose={() => setSelectedImage(null)} 
                title="Blog Image Preview"
                size="2xl"
            >
                <div className="p-6">
                    <div className="flex justify-center">
                        <Image 
                            src={selectedImage || '/Images/Programs/image1.png'} 
                            alt="Blog image" 
                            width={500} 
                            height={300} 
                            className="rounded-lg object-cover max-w-full h-auto"
                            onError={(e) => {
                                console.log('Modal image failed to load:', selectedImage);
                                // Fallback to default image on error
                                const target = e.target as HTMLImageElement;
                                target.src = '/Images/Programs/image1.png';
                            }}
                            onLoad={() => {
                                console.log('Modal image loaded successfully:', selectedImage);
                            }}
                        />
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={!!selectedDescription} 
                onClose={() => setSelectedDescription(null)} 
                title="Blog Description"
                size="2xl"
            >
                <div className="p-6">
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{selectedDescription}</p>
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={!!selectedContent} 
                onClose={() => setSelectedContent(null)} 
                title="Blog Content"
                size="4xl"
            >
                <div className="p-6">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedContent || '' }} />
                </div>
            </Modal>

            <Modal 
                isOpen={showImageSummary} 
                onClose={() => setShowImageSummary(false)} 
                title="Blog Images Summary"
                size="4xl"
            >
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                            This shows the current state of all blog images and whether they are valid.
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableHeaderCell>Blog Title</TableHeaderCell>
                                        <TableHeaderCell>Image URL</TableHeaderCell>
                                        <TableHeaderCell>Status</TableHeaderCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {imageSummary.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="font-mono text-sm">{item.image}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.isValid 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.isValid ? 'Valid' : 'Invalid'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

type ActionProps = {
    blog: Blog
    setData: React.Dispatch<React.SetStateAction<Blog[]>>
}

const Action = ({ blog, setData }: ActionProps) => {
    const [edit, setEdit] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await deleteBlog(blog._id as string).then(() => {
            setData((prev) => prev.filter((b) => b._id !== blog._id))
            setDeletePopup(false)
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <div className='flex items-center gap-2'>
                <Button 
                    size='sm' 
                    variant="outline" 
                    onClick={() => setEdit(true)}
                >
                    <Edit size={14} />
                    Edit
                </Button>
                <Button 
                    size='sm' 
                    variant='outline' 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    onClick={() => setDeletePopup(true)}
                >
                    <Trash2 size={14} />
                    Delete
                </Button>
            </div>

            <Modal 
                isOpen={edit} 
                onClose={() => setEdit(false)} 
                title="Edit Blog"
                size="4xl"
            >
                <div className="p-6">
                    <AddBlog setData={setData} setOpen={setEdit} isEdit={true} editData={blog} />
                </div>
            </Modal>

            <Modal 
                isOpen={deletePopup} 
                onClose={() => !loading && setDeletePopup(false)} 
                title="Delete Blog"
                size="md"
            >
                <div className='p-6 space-y-4'>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                            Are you sure you want to delete <strong>&ldquo;{blog.title}&rdquo;</strong>? 
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className='flex justify-end gap-3'>
                        <Button 
                            variant="outline" 
                            onClick={() => !loading && setDeletePopup(false)} 
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant='destructive' 
                            onClick={handleDelete} 
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : <Trash2 size={16} />}
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AdminBlogs