import axios from "axios"

export const generateContentAPI = async (userPrompt) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/openai/generate`, {
        prompt: userPrompt
    }, {
        withCredentials: true
    })
    return res?.data
}

export const getUserProfileAPI = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/api/v1/users/profile`, {
        withCredentials: true
    })
    return res?.data
}