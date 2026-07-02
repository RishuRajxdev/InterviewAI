import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/")
    }

  if (loading) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="loading-screen flex flex-col items-center text-center">
                <div className="spinner border-4 border-cyan-600/20 border-t-cyan-600 rounded-full h-12 w-12 animate-spin"></div>
                <p className="text-cyan-600 mt-4 font-semibold">Please wait...</p>
            </div>
        </main>
    )
}

    return (
        <main>
            <div className="form-container">
                <h1>Register/Sign-Up</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    <button className='button primary-button' >Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} className='hover:text-cyan-600'>Login</Link> </p>
            </div>
        </main>
    )
}

export default Register