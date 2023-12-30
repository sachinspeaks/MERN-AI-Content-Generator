const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    trialPeriod: {
        type: Number,
        default: 3
    },
    trialActive: {
        type: Boolean,
        default: true
    },
    trialExpires: {
        type: Date,
    },
    subscriptionPlan: {
        type: String,
        enum: ['Trial', 'Free', 'Basic', 'Premium'],
        default: 'Trial',
    },
    apiRequestCount: {
        type: Number,
        default: 0
    },
    monthlyRequestCount: {
        type: Number,
        default: 100
    },
    nextBillingDate: {
        type: Date,
    },
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId` is a data type used to define a field in a Mongoose schema that will store MongoDB ObjectIDs.
            ref: 'Payment'
        }
    ],
    history: [
        {
            type: mongoose.Schema.Types.ObjectId, //mongoose.Schema.Types.ObjectId` is a data type used to define a field in a Mongoose schema that will store MongoDB ObjectIDs.
            ref: 'contentHistory'
        }
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const User = mongoose.model("User", userSchema)
module.exports = User