const asyncHandler = require('express-async-handler')
const calculateNextBillingDate = require('../utils/calculateNextBillingDate')
const shouldRenewSubscriptionPlan = require('../utils/shouldRenewSubscriptionPlan')
const Payment = require('../models/Payments')
const User = require('../models/User')
const { response } = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const handleStripePayment = asyncHandler(async (req, res, next) => {
    const { amount, subscriptionPlan } = req.body
    const user = req?.user
    try {
        const paymentIntent = await stripe.paymentIntents.create({ //PaymentIntent is an object that represents your intent to collect payment from a customer.
            amount: Number(amount) * 100,
            currency: 'inr',
            description: "for Mern project",
            shipping: {
                name: "Random singh",
                address: {
                    line1: "510 Townsend St",
                    postal_code: "96162",
                    city: "San Francisco",
                    state: "CA",
                    country: "United States",
                },
            },
            metadata: {
                userId: user?._id?.toString(),
                userEmail: user?.email,
                subscriptionPlan
            }

        })
        res.json({
            clientSecret: paymentIntent?.client_secret,
            paymentId: paymentIntent?.id,
            metadata: paymentIntent?.metadata
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentID } = req.params
    console.log(JSON.stringify(paymentID), 'paymentID')
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentID)
        if (paymentIntent.status === 'succeeded') {
            console.log(paymentIntent, 'paymentIntent')
            const metadata = paymentIntent?.metadata
            const subscriptionPlan = metadata?.subscriptionPlan
            const userEmail = metadata?.userEmail
            const userId = metadata?.userId
            const userFound = await User.findById(userId)
            if (!userFound) {
                return res.status(404).json({ status: "false", message: "User not found" })
            }
            const amount = paymentIntent?.amount / 100
            const currency = paymentIntent?.currency
            const paymentId = paymentIntent?.id

            const newPayment = await Payment.create({
                user: userId,
                email: userEmail,
                subscriptionPlan,
                amount,
                currency,
                status: "success",
                reference: paymentId,
            })
            if (subscriptionPlan === "Basic") {
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan: subscriptionPlan,
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 50,
                    subscriptionPlan: "Basic",
                    $addToSet: { payments: newPayment?._id }
                })
                return res.json({
                    status: true,
                    message: "Payment verified successfully, User updated.",
                    updatedUser
                })
            }
            if (subscriptionPlan === "Premium") {
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan: subscriptionPlan,
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 100,
                    subscriptionPlan: "Premium",
                    $addToSet: { payments: newPayment?._id }
                })
                return res.json({
                    status: true,
                    message: "Payment verified successfully, User updated.",
                    updatedUser
                })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})

const handleFreeSubscription = asyncHandler(async (req, res, next) => {
    const user = req.user
    calculateNextBillingDate()
    try {
        if (shouldRenewSubscriptionPlan(user)) {
            user.subscriptionPlan = 'Free'
            user.monthlyRequestCount = 10
            user.apiRequestCount = 0
            user.nextBillingDate = calculateNextBillingDate()
            const newPayment = Payment.create({
                user: user?._id,
                subscriptionPlan: "Free",
                amount: 0,
                status: "Success",
                reference: Math.random().toString(36).substring(7),
                monthlyRequestCount: 10,
                currency: "inr",

            })
            user.payments.push(newPayment?._id)
            await user.save()
            return res.status(200).json({
                status: "Success",
                message: "Subscription plan updated successfully.",
                user
            })
        }
        else {
            return res.status(403).json({ error: "Subscription plan is still active." })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})

module.exports = { handleStripePayment, handleFreeSubscription, verifyPayment }