import Container from "@/components/Container";
import { getAllCart } from "@/Server/Cart";
import React from "react";
import InitiatePayment from "./InitiatePayment";
import Action from "./Action";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined; }>
};

const CartPage = async ({ searchParams }: Props) => {
    const searchParamsList = await searchParams;
    const cart = await getAllCart({ searchParams: { ...searchParamsList } });

    if (!cart || cart.count === 0) {
        return (
            <Container className="py-10">
                <h1 className="text-2xl font-bold mb-6">No items in cart</h1>
            </Container>
        );
    }

    return (
        <Container className="py-10">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
            <p className="mb-4">Please complete the payment for course enrollment</p>
            <table className="w-full border-collapse mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Course Name</th>
                        <th className="p-2 text-left">Programme Name</th>
                        <th className="p-2 text-left">Subject Title</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-left">Currency</th>
                        <th className="p-2 text-left">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {cart.list.map((item) => (
                        <tr key={item._id?.toString() ?? Math.random().toString()} className="border-b">
                            <td className="p-2">{item.course}</td>
                            <td className="p-2">{item.program}</td>
                            <td className="p-2">{item.subjects?.join(", ")}</td>
                            <td className="p-2 text-right">{item.price.amount}</td>
                            <td className="p-2">{item.price.type}</td>
                            <td className="p-2">
                                <Action item={item} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right font-semibold">
                Total:  {cart.list[0]?.price.type == 'INR' ? "₹" : "$"} {cart.list?.reduce((acc, item) => acc + item.price.amount, 0).toFixed(2)}
            </div>

            <InitiatePayment cart={cart.list} />

        </Container>
    );
};

export default CartPage