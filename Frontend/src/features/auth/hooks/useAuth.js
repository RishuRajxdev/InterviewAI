import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import toast from "react-hot-toast";
import { login, register, logout, getMe } from "../services/auth.api.js";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


   const handleLogin = async ({ identifier, password }) => {
    setLoading(true)
    try {
        const data = await login({ identifier, password })
        setUser(data.user)
        toast.success("Logged in successfully")
        return true
    } catch (err) {
        const message = err?.response?.data?.message || "Login failed. Please try again."
        toast.error(message)
        return false
    } finally {
        setLoading(false)
    }
}

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            toast.success("Account created successfully")
            return true
        } catch (err) {
            const message = err?.response?.data?.message || "Registration failed. Please try again."
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            toast.success("Logged out")
            return true
        } catch (err) {
            const message = err?.response?.data?.message || "Logout failed. Please try again."
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // Expected when no one is logged in yet — stay silent, no toast
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}