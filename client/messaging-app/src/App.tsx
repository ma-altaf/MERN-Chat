import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Error from "./pages/Error";
import Home from "./pages/Home";
import AuthContext from "./context/AuthContext";
import ChatRoom from "./pages/ChatRoom";
import SocketContext from "./context/SocketContext";

function App() {
    return (
        <BrowserRouter>
            <AuthContext>
                <SocketContext>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/home" element={<Home />} />
                        <Route
                            path="/chat_room/:roomID"
                            element={<ChatRoom />}
                        />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </SocketContext>
            </AuthContext>
        </BrowserRouter>
    );
}

export default App;
