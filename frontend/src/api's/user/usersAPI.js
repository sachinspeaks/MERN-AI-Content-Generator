import axios from "axios"

export const registerAPI = async (userData) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/users/register`, {
        username: userData?.username,
        email: userData?.email,
        password: userData?.password
    }, {
        withCredentials: true
    })
    return res?.data
}

export const loginAPI = async (userData) => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/users/login`, {
        email: userData?.email,
        password: userData?.password
    }, {
        withCredentials: true
    })
    return res?.data
}

export const checkUserAuthStatusAPI = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/api/v1/users/auth/check`, {
        withCredentials: true
    })
    return res?.data
}

export const logoutAPI = async () => {
    const res = await axios.post(`${import.meta.env.VITE_PORT}/api/v1/users/logout`, {}, {
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