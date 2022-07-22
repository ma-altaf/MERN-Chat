import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { authcontext } from "../context/AuthContext";
import { socketContext } from "../context/SocketContext";

type messageType = {
    content: string;
    sender: string;
    roomID: string;
};

function ChatRoom() {
    const isMsgRequested = useRef(false);
    const [user] = useContext(authcontext);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messageType[]>([]);

    useEffect(() => {
        const joinedHandler = (messageRes: messageType[]) => {
            console.log(messageRes);
            setMessages((prev) => [...messageRes, ...prev]);
        };

        const newMsg = (msg: messageType) =>
            setMessages((prev) => [...prev, msg]);

        socket?.on("joined", joinedHandler);

        socket?.on("receive_msg", newMsg);

        if (socket && !isMsgRequested.current) {
            isMsgRequested.current = true;
            socket?.emit("join_room", roomID);
            console.log("request made:", socket);
        }

        return () => {
            socket?.off("joined", joinedHandler);
            socket?.off("receive_msg", newMsg);
        };
    }, [socket]);

    const sendMsg = () => {
        // do not send the message if there is no text content
        if (message.length === 0) {
            return;
        }
        const newMsg: messageType = {
            content: message,
            sender: user?.username || "",
            roomID: roomID!,
        };
        socket?.emit("send_msg", newMsg);

        // clear message text input on message submission
        setMessage("");

        // display message locally
        setMessages((prev) => [...prev, newMsg]);
    };

    return (
        <>
            {messages.map((msg: messageType, i) => (
                <div key={i}>{msg.content}</div>
            ))}
            <input
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMsg}>send message</button>
        </>
    );
}

export default ChatRoom;
