import React from 'react'
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const { loading,user } = useAuth()

if (loading) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
        </main>
    )
}
    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected