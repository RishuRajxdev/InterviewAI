import React,{useState} from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [ identifier, setIdentifier ] = useState("")
    const [ password, setPassword ] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await handleLogin({identifier,password})
        if (success) {
            navigate('/')
        }
    }
   if (loading) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
        </main>
    )
}
    return (
        <main>
            <div className="form-container">
                <h1>Login/Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="identifier">Email or Username</label>
                        <input
                            onChange={(e) => { setIdentifier(e.target.value) }}
                            type="text" id="identifier" name='identifier' placeholder='Enter email or username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} className='hover:text-cyan-600' >Register</Link> </p>
            </div>
        </main>
    )
}
export default Login; 