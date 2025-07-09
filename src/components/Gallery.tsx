'use client'

import React from 'react'
import SafeImage from './SafeImage'
import { getValidImageUrl } from '@/utils/imageUtils'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { motion } from 'framer-motion'

type Props = {
    data: { _id: string, image: string, title: string, description: string }[]
}

const Gallery = ({ data }: Props) => {
    const [opened, setOpened] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState<{ image: string, title: string, description: string } | null>(null);

    const handleImageClick = (item: { _id: string, image: string, title: string, description: string }) => {
        setSelectedImage(item);
        setOpened(item._id);
    };

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {data.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className='group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer'
                        onClick={() => handleImageClick(item)}
                    >
                        <SafeImage
                            src={getValidImageUrl(item.image)}
                            alt={item.title || 'Gallery image'}
                            width={400}
                            height={300}
                            className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Dialog open={opened !== ''} onOpenChange={() => {
                setOpened('');
                setSelectedImage(null);
            }}>
                <DialogContent className='w-[90vw] h-[90vh] !max-w-screen !max-h-screen p-0 bg-black/95'>
                    <DialogTitle className='sr-only'>Image Preview</DialogTitle>
                    {selectedImage && (
                        <div className='relative w-full h-full flex flex-col'>
                            <div className='relative flex-1 flex items-center justify-center p-6'>
                                <SafeImage
                                    src={getValidImageUrl(selectedImage.image)}
                                    alt={selectedImage.title || 'Gallery image'}
                                    width={1200}
                                    height={800}
                                    className="object-contain max-w-full max-h-full"
                                    priority
                                />
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 bg-black/70 p-6 text-white'>
                                <h3 className='text-xl font-semibold mb-2'>{selectedImage.title}</h3>
                                <p className='text-gray-200'>{selectedImage.description}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Gallery