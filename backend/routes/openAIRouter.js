const express = require('express')
const openAIController = require('../controllers/openAIController')
const isAuthenticated = require('../middlewares/isAuthenticated')
const checkApiRequestLimit = require('../middlewares/checkApiRequestLimit')

const openAIRouter = express.Router()

openAIRouter.post('/generate', isAuthenticated, checkApiRequestLimit, openAIController)


module.exports = openAIRouter