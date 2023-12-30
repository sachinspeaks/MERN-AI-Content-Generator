const User = require("../models/User")
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please fill all the fields.")
    }
    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
        res.status(400)
        throw new Error("User already exists.")
    }

    const salt = await bcrypt.genSalt(10) //In the context of password hashing and cryptography, a "salt" is a random value that is used as an additional input to a one-way function (hash function) along with the password.
    const hashedPassword = await bcrypt.hash(password, salt) //bcrypt.genSalt(10) generates a salt for use in the password hashing process. The 10 represents the cost factor, which determines how computationally expensive the hashing will be. The higher the cost factor, the more secure the hash, but also the more computationally expensive it is to generate.

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    })

    newUser.trialExpires = new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    await newUser.save()

    res.json({
        status: true,
        message: "Registration was Successful.",
        user: {
            username,
            email
        }
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(401)
        throw new Error("Invalid email or password.")
    }
    const isMatched = await bcrypt.compare(password, user?.password)
    if (!isMatched) {
        res.status(401)
        throw new Error("Invalid email or password.")
    }

    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', //The SameSite attribute in cookies is a security feature that helps mitigate the risk of cross-site request forgery (CSRF) attacks. When a cookie has SameSite=Strict, the cookie will only be sent in a first-party context, meaning the cookie will only be sent along with top-level navigation and direct requests initiated by the user. It won't be sent along with cross-site requests initiated by third-party websites. 
        maxAge: 1000 * 60 * 60 * 24 * 3

    })

    return res.json({
        status: "Success",
        _id: user?._id,
        message: "Login was successful.",
        username: user?.username,
        email: user?.email
    })
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: "Logout was successful."
    })
})


const userProfile = asyncHandler(async (req, res) => {
    const id = req?.user?.id
    const user = await User.findById(id).select("-password").populate("payments").populate('history') //.select(-password) to exclude the 'password' field from the query results.
    if (user) {
        return res.status(200).json({
            status: "Success",
            user
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const checkAuth = asyncHandler(async (req, res) => {
    const decoded = jwt.verify(req?.cookies?.token, process.env.JWT_SECRET)
    if (decoded) {
        res.json({
            isAuthenticated: true,
        })
    }
    else {
        res.json({
            isAuthenticated: false,
        })
    }
})

module.exports = {
    register,
    login,
    logout,
    userProfile,
    checkAuth,
}