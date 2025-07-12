
import client from '@/utils/paypal'
import { CheckoutPaymentIntent, Order, OrdersController } from '@paypal/paypal-server-sdk'

export const createOrder = async ({ order_price, currency_code }: {
    order_price: string, currency_code: string
}): Promise<Order | string> => {

    const ordersController = new OrdersController(client);
    console.log('Creating order with:', { order_price, currency_code });

    const collect = {
        body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    amount: {
                        currencyCode: currency_code,
                        value: order_price,
                    },
                }
            ],
        },
        prefer: 'return=minimal'
    }

    console.log(collect, 'collect')

    try {
        const { result, ...httpResponse } = await ordersController.createOrder(collect);
        if (httpResponse.statusCode === 201) {
            return result;
        } else {
            return "Something went wrong with the order creation. Please try again later.";
        }
    } catch {
        return "Something went wrong with the order creation. Please try again later.";
    }

}

export const captureOrder = async ({ orderID }: { orderID: string }): Promise<Order | string> => {
    const ordersController = new OrdersController(client);

    const collect = {
        id: orderID,
        prefer: 'return=minimal'
    }

    try {
        const { result, ...httpResponse } = await ordersController.captureOrder(collect);
        if (httpResponse.statusCode === 201) {
            return result;
        } else {
            return "Something went wrong with the order capture. Please try again later.";
        }

    } catch {
        return "Something went wrong with the order capture. Please try again later.";
    }
}