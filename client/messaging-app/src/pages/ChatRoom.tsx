import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { authcontext } from "../context/AuthContext";
import { socketContext } from "../context/SocketContext";

type messageType = {
    content: string;
    sender: string;
    roomID: string;
};

const NUM_MSG = 3;

function ChatRoom() {
    const isMsgRequested = useRef(false);
    const [user] = useContext(authcontext);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isLastMessage, setIsLastMessage] = useState(false);

    useEffect(() => {
        const getPrevMsg = async (messageRes: messageType[]) => {
            messageRes.reverse();
            setMessages((prev) => [...messageRes, ...prev]);
            setIsLastMessage(messageRes.length < NUM_MSG);
        };

        const newMsg = (msg: messageType) =>
            setMessages((prev) => [...prev, msg]);

        socket?.on("joined", getPrevMsg);

        socket?.on("receive_msg", newMsg);

        socket?.on("get_msg", getPrevMsg);

        if (socket && !isMsgRequested.current) {
            isMsgRequested.current = true;
            socket?.emit("join_room", roomID);
            console.log("request made:", socket);
        }

        return () => {
            socket?.off("joined", getPrevMsg);
            socket?.off("receive_msg", newMsg);
            socket?.off("get_msg", getPrevMsg);
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

    const getMsg = async () => {
        socket?.emit("get_msg");
    };

    return (
        <>
            {!isLastMessage && <button onClick={getMsg}>load more</button>}
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
