import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import style from './Login.module.css'

type credentialsType = {
    username: string,
    password: string
}

const emptyCredentials: credentialsType = {
    username: '',
    password: ''
}

const Login = () => {
    const [credentials, setCredentials] = useState<credentialsType>(emptyCredentials)
    const socket = useContext(SocketContext)
    // const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // navigate('/chat')
        setCredentials(emptyCredentials)
    }
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, username: e.target.value})
    }
    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, password: e.target.value})
    }

    return <div className={style.wrapper}>
        <header>Log in</header>
        <form onSubmit={handleLogin} className={style.form} >
            <div className={style.credentials}>
                <input type="text" placeholder='Username' autoComplete='username' value={credentials.username} onChange={handleUserChange} />
                <input type="password" placeholder='Passowrd' autoComplete='current-password' value={credentials.password} onChange={handlePassChange} />
            </div>
            <input type="submit" value="Login" />
        </form>
    </div>
}

export default Login