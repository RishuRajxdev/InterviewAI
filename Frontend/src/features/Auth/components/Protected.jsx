import React from 'react'
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const { loading,user } = useAuth()

if (loading) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-64 space-y-3 animate-pulse">
                <div className="h-4 rounded bg-slate-800 w-3/4" />
                <div className="h-4 rounded bg-slate-800 w-full" />
                <div className="h-4 rounded bg-slate-800 w-5/6" />
            </div>
        </main>
    )
}
    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected