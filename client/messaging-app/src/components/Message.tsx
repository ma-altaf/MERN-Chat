import { useContext } from "react";
import { authcontext } from "../context/AuthContext";

export type messageType = {
    content: string;
    sender: { username: string };
    roomID: string;
};

type Props = {
    message: messageType;
};

function Message({ message }: Props) {
    const [user] = useContext(authcontext);

    return (
        <span
            className={`w-full h-fit flex ${
                message.sender.username === user?.username
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`px-2 py-1 m-1 rounded-md  w-fit h-fit ${
                    message.sender.username === user?.username
                        ? "bg-green-100"
                        : "bg-gray-200"
                }`}
            >
                {message.content}
            </div>
        </span>
    );
}

export default Message;
