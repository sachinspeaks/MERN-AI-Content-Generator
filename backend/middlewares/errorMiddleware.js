const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        message: error.message,
        // It checks the value of the NODE_ENV environment variable, and if it's set to "production," it sets the stack property of the error object to null. This is often done to avoid leaking sensitive information about the error to the client in a production environment.
        stack: process.env.NODE_ENV === "production" ? null : error.stack //error.stack is a property of an error object that provides a string representing the stack trace of the error.
    })
}

module.exports = {
    errorHandler
}

/*
Express-async-handler package provides a utility function to wrap asynchronous route handlers, allowing you to use async/await syntax without explicitly wrapping your code in a try-catch block.
This allows you to use async/await syntax directly without manually handling errors using try/catch. Any errors thrown within the asynchronous handler are automatically caught and passed to the error-handling middleware.
*/