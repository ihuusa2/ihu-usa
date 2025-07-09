import React from 'react'

type Props = {
    status: boolean
}

const Status = ({ status }: Props) => {
    return (
        <div className="flex items-center justify-center size-3 rounded-full overflow-hidden">
            {status ? (
                <>
                    <div className="bg-green-500 size-full" />
                </>
            ) : (
                <>
                    <div className="bg-red-500 size-full" />
                </>
            )}
        </div>
    )
}

export default Status