import { useContext } from "react";
import { authcontext } from "../context/AuthContext";

export type MsgContentType = "text" | "image";

export type messageType = {
    content: string;
    sender: { username: string };
    type: MsgContentType;
    roomID: string;
};

type Props = {
    message: messageType;
};

function Message({ message }: Props) {
    const { sender, content, type } = message;
    const [user] = useContext(authcontext);

    return (
        <span
            className={`w-full h-fit flex ${
                sender.username === user?.username
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`p-1 m-1 rounded-lg  w-fit h-fit max-w-[50%] break-words overflow-hidden ${
                    sender.username === user?.username
                        ? "bg-green-100"
                        : "bg-gray-200"
                }`}
            >
                <MsgContent type={type} content={content} />
            </div>
        </span>
    );
}

type ContentProp = {
    type: string;
    content: string;
};

function MsgContent({ type, content }: ContentProp) {
    switch (type) {
        case "image":
            return <img src={content} className="rounded-lg" />;
    }
    return <p>{content}</p>;
}

export default Message;
