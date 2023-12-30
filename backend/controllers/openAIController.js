const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai")
const marked = require('marked');
const contentHistory = require("../models/ContentHistory");
const User = require("../models/User");


const openAIController = asyncHandler(async (req, res) => {
    const { prompt } = req.body
    // console.log("User ", req.user)
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        async function run() {
            const generationConfig = {
                stopSequences: ["red"],
                maxOutputTokens: 500,
                temperature: 0.9,
                topP: 0.1,
                topK: 16,
            };
            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
            const result = await model.generateContent(prompt);
            const response = await result.response;

            const markdownContent = response.text();
            const plaintext = marked.parse(markdownContent)
            // const plaintext = "Test"
            const newContent = await contentHistory.create({ user: req.user?._id, content: plaintext })
            const userFound = await User.findById(req.user?.id)
            userFound.history.push(newContent?._id)
            userFound.apiRequestCount += 1
            await userFound.save()
            res.status(200).send(plaintext)
        }
        run();
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = openAIController