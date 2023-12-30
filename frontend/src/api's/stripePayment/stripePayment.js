import axios from "axios"

export const handleFreeSubscriptionAPI = async () => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/stripe/free-plan/`, {}, {
        withCredentials: true
    })
    return res?.data
}

export const createStripePaymentIntentAPI = async (payment) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/stripe/checkout/`, {
        amount: Number(payment?.amount),
        subscriptionPlan: payment?.plan
    }, {
        withCredentials: true
    })
    return res?.data
}


export const verifyPaymentAPI = async (paymentID) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/stripe/verify-payment/${paymentID}`, {}, {
        withCredentials: true
    })
    return res?.data
}
