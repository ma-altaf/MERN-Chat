import { useContext } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "./Home";

function ChatRoom() {
    const socket = useContext(socketContext);
    const { roomID } = useParams();
    socket.on("connect", () => {
        console.log("hello world");
    });

    return <div>{roomID}</div>;
}

export default ChatRoom;
