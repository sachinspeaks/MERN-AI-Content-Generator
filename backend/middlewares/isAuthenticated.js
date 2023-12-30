const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const User = require('../models/User')


const isAuthenticated = asyncHandler(async (req, res, next) => {
    if (req.cookies.token) {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET) //this denotes the actual logged in user.
        req.user = await User.findById(decoded?.id).select('-password')
    }
    else {
        return res.status(401).json({ message: "Not authorized, no token" })
    }
    next();
})

module.exports = isAuthenticated