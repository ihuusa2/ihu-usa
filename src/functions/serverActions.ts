/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from 'mongodb';

export function parseQuery(searchParams: { [key: string]: string | string[] | undefined }
    | Record<string, string>): Record<string, string | ObjectId | RegExp | number | Date> {
    const entries = Object.entries(searchParams);

    return Object.fromEntries(
        entries
            .filter(([_, value]) => value !== '') // Filter out empty string values
            .map(([key, value]) => {
                let parsedValue: string | ObjectId | RegExp | number | Date;
                if (key === 'sortBy' || key === 'sortOrder' || key === 'page' || key === 'pageSize' || key === 'sort') {
                    parsedValue = value as string;
                } else if (key === 'search' || key === 'type' || key === 'filterBy' || key === 'status') {
                    // Keep these as strings for manual handling
                    parsedValue = value as string;
                } else if (ObjectId.isValid(value as string)) {
                    parsedValue = new ObjectId(value as string);
                } else {
                    parsedValue = new RegExp(value as string, 'i');
                }
                return [key, parsedValue];
            })
    );
}
