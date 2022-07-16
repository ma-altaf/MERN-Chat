import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(`${process.env.REACT_APP_REST_API_URL}`);

function ChatRoom() {
    socket.on("connect", () => {
        console.log("hello world");
    });
    const { roomID } = useParams();

    return <div>{roomID}</div>;
}

export default ChatRoom;
