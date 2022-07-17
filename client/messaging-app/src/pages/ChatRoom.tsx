import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/SocketContext";

type messageType = {};

function ChatRoom() {
    const { roomID } = useParams();
    const socket = useContext(socketContext);
    const [messages, setMessages] = useState<messageType[]>([]);

    useEffect(() => {
        socket?.emit("join_room", roomID);

        const joinedHandler = (messageRes: messageType[]) => {
            console.log(messageRes);
            setMessages((prev) => [...messageRes, ...prev]);
        };

        socket?.on("joined", joinedHandler);

        return () => {
            socket?.off("joined", joinedHandler);
        };
    }, [socket]);

    return <div>{roomID}</div>;
}

export default ChatRoom;
