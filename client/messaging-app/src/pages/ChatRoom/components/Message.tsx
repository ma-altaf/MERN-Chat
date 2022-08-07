import { useContext } from "react";
import { authcontext } from "../../../context/AuthContext";

export type MsgContentType = "text" | "image" | "video" | "audio";

export type messageType = {
    content: string;
    sender: { username: string };
    type: MsgContentType;
    roomID: string;
    createdAt: string;
};

type Props = {
    message: messageType;
};

function Message({ message }: Props) {
    const { sender, content, type, createdAt } = message;
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
                className={`p-1 m-1 rounded-lg  w-fit h-fit max-w-[90%] md:max-w-[60%] break-words overflow-hidden ${
                    sender.username === user?.username
                        ? "bg-black text-white"
                        : "bg-gray-200"
                }`}
            >
                <MsgContent type={type} content={content} />
                <p className="w-full text-right">
                    {new Date(createdAt).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </p>
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
            return (
                <img
                    src={content}
                    className="rounded-lg"
                    onClick={() => window.open(content)}
                />
            );
        case "video":
            return (
                <video src={content} controls className="rounded-lg"></video>
            );
        case "audio":
            return (
                <audio
                    controls
                    src={content}
                    className="bg-[#f1f3f4] rounded-lg"
                ></audio>
            );
    }
    return <p>{content}</p>;
}

export default Message;