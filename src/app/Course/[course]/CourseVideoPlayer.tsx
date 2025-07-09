'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw } from 'lucide-react'

interface CourseVideoPlayerProps {
    videoUrl: string
    title: string
    description?: string
    thumbnail?: string
    isYouTube?: boolean
    youtubeId?: string
}

export default function CourseVideoPlayer({ 
    videoUrl, 
    title, 
    description, 
    thumbnail, 
    isYouTube = false, 
    youtubeId 
}: CourseVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedMetadata = () => {
            setDuration(video.duration)
            setIsLoading(false)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('ended', handleEnded)

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('timeupdate', handleTimeUpdate)
            video.removeEventListener('ended', handleEnded)
        }
    }, [])

    useEffect(() => {
        if (isPlaying) {
            setShowControls(true)
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }
    }, [isPlaying, currentTime])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
        setIsFullscreen(!isFullscreen)
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video) return

        const newTime = parseFloat(e.target.value)
        video.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleRestart = () => {
        const video = videoRef.current
        if (!video) return

        video.currentTime = 0
        setCurrentTime(0)
        if (!isPlaying) {
            video.play()
            setIsPlaying(true)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleMouseMove = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }
    }

    if (isYouTube && youtubeId) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="p-6">
                    <h4 className="font-bold text-[var(--spiritual-blue)] mb-3 text-lg text-center">{title}</h4>
                    {description && (
                        <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">{description}</p>
                    )}
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                            <iframe 
                                width="100%" 
                                height="220" 
                                src={`https://www.youtube.com/embed/${youtubeId}`} 
                                title={title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                                className="rounded-xl shadow-lg" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="p-6">
                <h4 className="font-bold text-[var(--spiritual-blue)] mb-3 text-lg text-center">{title}</h4>
                {description && (
                    <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">{description}</p>
                )}
                <div className="flex justify-center">
                    <div 
                        ref={containerRef}
                        className="relative w-full max-w-sm group"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => {
                            if (isPlaying) {
                                setShowControls(false)
                            }
                        }}
                    >
                        <video
                            ref={videoRef}
                            className="w-full h-auto rounded-xl shadow-lg"
                            poster={thumbnail}
                            preload="metadata"
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Controls Overlay */}
                        <div 
                            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl transition-opacity duration-300 ${
                                showControls ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlay}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors duration-200"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 text-white" />
                                ) : (
                                    <Play className="w-6 h-6 text-white ml-1" />
                                )}
                            </button>

                            {/* Bottom Controls */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                {/* Progress Bar */}
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, white 0%, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                                    }}
                                />

                                {/* Control Buttons */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={togglePlay}
                                            className="bg-white/20 backdrop-blur-sm rounded-full p-1 hover:bg-white/30 transition-colors duration-200"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-4 h-4 text-white" />
                                            ) : (
                                                <Play className="w-4 h-4 text-white ml-0.5" />
                                            )}
                                        </button>

                                        <button
                                            onClick={toggleMute}
                                            className="bg-white/20 backdrop-blur-sm rounded-full p-1 hover:bg-white/30 transition-colors duration-200"
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-4 h-4 text-white" />
                                            ) : (
                                                <Volume2 className="w-4 h-4 text-white" />
                                            )}
                                        </button>

                                        <button
                                            onClick={handleRestart}
                                            className="bg-white/20 backdrop-blur-sm rounded-full p-1 hover:bg-white/30 transition-colors duration-200"
                                        >
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>

                                        <button
                                            onClick={toggleFullscreen}
                                            className="bg-white/20 backdrop-blur-sm rounded-full p-1 hover:bg-white/30 transition-colors duration-200"
                                        >
                                            {isFullscreen ? (
                                                <Minimize className="w-4 h-4 text-white" />
                                            ) : (
                                                <Maximize className="w-4 h-4 text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 