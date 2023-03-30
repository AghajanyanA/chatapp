import { Route, Routes } from "react-router-dom";
import Chat from "../Components/Pages/Chat/Chat";
import Login from "../Components/Pages/Login/Login";
import Register from "../Components/Pages/Register/Register";

const ChatRouter = () => (
    <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/chat" element={ <Chat /> } />
    </Routes>
)

export default ChatRouter