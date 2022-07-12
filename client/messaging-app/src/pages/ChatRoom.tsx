import { useParams } from "react-router-dom";

function ChatRoom() {
    const { roomID } = useParams();
    return <div>{roomID}</div>;
}

export default ChatRoom;
