export interface Webhook {
    id: string;
    event_version: string;
    create_time: string;
    resource_type: string;
    resource_version: string;
    event_type: string;
    summary: string;
    resource: {
        create_time: string;
        purchase_units: Array<{
            reference_id: string;
            amount: {
                currency_code: string;
                value: string;
                breakdown: Record<string, unknown>;
            };
            payee: {
                email_address: string;
                merchant_id: string;
            };
            shipping: {
                name: {
                    full_name: string;
                };
                address: {
                    address_line_1: string;
                    admin_area_2: string;
                    admin_area_1: string;
                    postal_code: string;
                    country_code: string;
                };
            };
        }>;
        links: Array<{
            href: string;
            rel: string;
            method: string;
        }>;
        id: string;
        payment_source: {
            paypal: {
                email_address: string;
                account_id: string;
                account_status: string;
                name: {
                    given_name: string;
                    surname: string;
                };
                address: {
                    country_code: string;
                };
            };
        };
        intent: string;
        payer: {
            name: {
                given_name: string;
                surname: string;
            };
            email_address: string;
            payer_id: string;
            address: {
                country_code: string;
            };
        };
        status: string;
    };
    links: Array<{
        href: string;
        rel: string;
        method: string;
    }>;
}