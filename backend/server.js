require('dotenv').config();
const express = require('express')
const cron = require('node-cron')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const usersRouter = require('./routes/usersRouter')
const openAIRouter = require('./routes/openAIRouter')
const stripeRouter = require('./routes/stripeRouter')
require('./utils/connectDB')()
const { errorHandler } = require('./middlewares/errorMiddleware');
const User = require('./models/User');


const PORT = process.env.PORT || 5000

//for trial period : runs every single day
cron.schedule("0 0 * * * *", async () => {
    try {
        console.log("ha aa gaya")
        const today = new Date()
        await User.updateMany({
            trialActive: true,
            nextBillingDate: {
                $lt: today
            }
        }, {
            trialActive: false,
            subscriptionPlan: "Free",
            monthlyRequestCount: 10

        })
    } catch (error) {
        console.log(error)
    }
})

//for free account : runs at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Free",
            nextBillingDate: {
                $lt: today
            }
        }, {
            monthlyRequestCount: 0
        })
    } catch (error) {
        console.log(error)
    }
})

//for basic account : runs at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Basic",
            nextBillingDate: {
                $lt: today
            }
        }, {
            monthlyRequestCount: 0
        })
    } catch (error) {
        console.log(error)
    }
})

//for premium account : runs at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan: "Premium",
            nextBillingDate: {
                $lt: today
            }
        }, {
            monthlyRequestCount: 0
        })
    } catch (error) {
        console.log(error)
    }
})

app.use(cookieParser())
app.use(express.json())
const corsOptions = {
    origin: ["http://localhost:5173", "https://mern-ai-content-generator-mium.vercel.app/"],
    credentials: true,
}
app.use(cors(corsOptions))
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/openai', openAIRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})