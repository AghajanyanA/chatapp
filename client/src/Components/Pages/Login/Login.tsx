import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import { setLogged } from '../../../redux/slices/loginSlice'
import { useAppDispatch } from '../../../redux/store'
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
    const credentialsNotEmpty = (credentials.username.trim().length > 0 && credentials.password.trim().length > 0) ? true : false
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (credentialsNotEmpty) {
            socket.emit('handle-login', credentials)
        }
        else {
            alert('Enter data')
        }
    }
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, username: e.target.value})
    }
    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, password: e.target.value})
    }

    useEffect(() => {
        const onSuccess = (socketID: string) => {
            dispatch(setLogged({status: true, username: credentials.username, socketID}))
            navigate('/chat')
        }
        const onUnsuccess = () => {
            alert('Check login and password')
        }

        socket.on('successful-login', onSuccess)
        socket.on('unsuccessful-login', onUnsuccess)

        return () => {
            socket.off('successful-login', onSuccess);
            socket.off('unsuccessful-login', onUnsuccess);
          }
    }, [socket])

    return <div className={style.wrapper}>
        <header>Log in</header>
        <form onSubmit={handleLogin} className={style.form} >
            <div className={style.credentials}>
                <input type="text" placeholder='Username' autoComplete='username' value={credentials.username} onChange={handleUserChange} />
                <input type="password" placeholder='Passowrd' autoComplete='current-password' value={credentials.password} onChange={handlePassChange} />
            </div>
            <input type="submit" value="Login" />
        </form>
        <p>No Account? No Worries! <Link to='/register'>Register Now!</Link></p>
    </div>
}

export default Login