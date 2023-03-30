import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import style from './Register.module.css'

type credentialsType = {
    username: string,
    password: string,
    repeat_password: string
}

const emptyCredentials: credentialsType = {
    username: '',
    password: '',
    repeat_password: ''
}

const Register = () => {

    const [credentials, setCredentials] = useState<credentialsType>(emptyCredentials)
    const socket = useContext(SocketContext)
    const credentialsNotEmpty = (credentials.username.trim().length > 0 && credentials.password.trim().length > 0) ? true : false
    const passwordsDoNotMatch = credentials.password !== credentials.repeat_password ? true : false
    // const navigate = useNavigate()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if(credentialsNotEmpty) {
            if(passwordsDoNotMatch) {
                alert("Passwords do not match")
                return
            }
            socket.emit('create-users-file', {username: credentials.username, password: credentials.password})
            // navigate('/chat')
            setCredentials(emptyCredentials)
        }
    }
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, username: e.target.value})
    }
    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, password: e.target.value})
    }
    const handleRepPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, repeat_password: e.target.value})
    }

    return <div className={style.wrapper}>
        <header>Sign Up</header>
        <form onSubmit={handleLogin} className={style.form} >
            <div className={style.credentials}>
                <input type="text" placeholder='Username' autoComplete='username' value={credentials.username} onChange={handleUserChange} />
                <input type="password" placeholder='Passowrd' autoComplete='current-password' value={credentials.password} onChange={handlePassChange} />
                <input type="password" placeholder='Repeat passowrd' autoComplete='current-password' value={credentials.repeat_password} onChange={handleRepPassChange} />
            </div>
            <input type="submit" value="Sign Up" />
        </form>
        <p>Already Have an Account? <Link to='/'>Log In</Link></p>
    </div>
}

export default Register