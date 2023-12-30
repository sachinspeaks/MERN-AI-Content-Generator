require('dotenv').config();
const express = require('express')
const cron = require('node-cron')
const app = express()
require('./utils/connectDB')()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const usersRouter = require('./routes/usersRouter')
const openAIRouter = require('./routes/openAIRouter')
const stripeRouter = require('./routes/stripeRouter')
const { errorHandler } = require('./middlewares/errorMiddleware');
const User = require('./models/User');


const PORT = process.env.PORT || 5000

// const corsOptions = {
//     origin: ["https://mern-ai-content-generator-mium.vercel.app"],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true,
// }
// app.use(cors(corsOptions))
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://mern-ai-content-generator-mium.vercel.app"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);

    next();
});

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


app.use('/api/v1/users', usersRouter)
app.use('/api/v1/openai', openAIRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})