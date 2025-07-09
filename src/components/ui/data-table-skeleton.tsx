import { Skeleton } from "@/components/ui/skeleton"

type Props = {
    columns: {
        header: string
    }[]
}

export default function DataTableSkeleton({ columns }: Props) {
    return (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns?.map((column) => (
                            <th
                                key={column.header}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 cursor-pointer">
                        {columns?.map((column) => (
                            <td key={column.header} className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-full" />
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer">
                        {columns?.map((column) => (
                            <td key={column.header} className="px-6 py-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-full" />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}