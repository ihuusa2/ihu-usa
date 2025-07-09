'use client'

import React, { useState, useEffect } from 'react'
import { createCourseType, updateCourseType } from '@/Server/CourseType'
import Spinner from '@/components/Spinner'
import type { CourseType } from '@/Types/Courses'

type Props = {
    setData: React.Dispatch<React.SetStateAction<CourseType[]>>
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isEdit?: boolean
    editData?: CourseType
}

const AddCourseType = ({ setData, setOpen, isEdit, editData }: Props) => {
    const [value, setValue] = useState<CourseType>(isEdit ? editData as CourseType : {
        title: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(editData as CourseType)
        }
    }, [isEdit, editData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (value.title.trim() === '') return

        setLoading(true)

        const formData: CourseType = {
            ...value,
        }

        if (isEdit) {
            await updateCourseType(formData).then((res) => {
                if (res) {
                    console.log(res)
                    setData((prev) => prev.map((courseType) => courseType._id === res._id ? res : courseType))
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            })
                .catch(() => {
                    setMessage('Something went wrong.')
                })
                .finally(() => setLoading(false))
        } else {
            await createCourseType(formData).then((res) => {
                if (res?.insertedId) {
                    setData((prev) => [
                        ...prev,
                        { ...formData, _id: res.insertedId.toString() },
                    ])
                    if (setOpen) {
                        setOpen(false)
                    }
                }
            }).catch(() => {
                setMessage('Something went wrong.')
            })
                .finally(() => setLoading(false))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {message && <div className='text-red-500 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>{message}</div>}
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                    <input
                        disabled={loading}
                        type="text"
                        id="title"
                        name="title"
                        value={value.title}
                        onChange={(e) => setValue({ ...value, title: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter course type title"
                    />
                </div>
            </div>
            <button 
                disabled={loading} 
                type="submit" 
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? <Spinner /> : (isEdit ? 'Update' : 'Create')}
            </button>
        </form>
    )
}

export default AddCourseType