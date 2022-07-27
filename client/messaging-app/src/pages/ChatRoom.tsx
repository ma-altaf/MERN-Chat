import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Message, { messageType } from "../components/Message";
import { authcontext } from "../context/AuthContext";
import { socketContext } from "../context/SocketContext";

const NUM_MSG = 3;

function ChatRoom() {
    const isMsgRequested = useRef(false);
    const [user] = useContext(authcontext);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isLastMessage, setIsLastMessage] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

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
            //TODO: remove console.log("request made:", socket);
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
            sender: { username: user?.username || "" },
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
        <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3">
            <div className="h-full w-full bg-green-200 hidden md:block"></div>
            <div className="h-screen w-full col-span-2 bg-gray-100 flex flex-col justify-end">
                <div
                    className="w-full max-h-full flex flex-col overflow-y-auto px-4 relative"
                    ref={messageListRef}
                >
                    {!isLastMessage && (
                        <button
                            className="bg-gray-300 rounded-lg px-2 w-fit m-1 mx-auto"
                            onClick={getMsg}
                        >
                            Load more
                        </button>
                    )}
                    {messages.map((msg: messageType, i) => (
                        <Message key={i} message={msg} />
                    ))}
                    {/* TODO: make the component only available when scroll is needed */}
                    <button
                        className="sticky bottom-0 right-0 mr-auto my-2 py-1 px-2 bg-gray-300 rounded-lg w-fit"
                        onClick={() => {
                            messageListRef.current &&
                                (messageListRef.current.scrollTop =
                                    messageListRef.current?.scrollHeight || 0);
                        }}
                    >
                        Scroll to bottom
                    </button>
                </div>
                <span className="flex justify-between py-2 sticky bottom-0 z-10 bg-gray-100 px-4">
                    <input
                        autoComplete="off"
                        className="rounded-lg shadow px-2 py-1 w-full"
                        type="text"
                        name="message"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className="uppercase px-2 py-1 ml-1 bg-green-500 rounded-lg"
                        onClick={sendMsg}
                    >
                        send
                    </button>
                </span>
            </div>
        </div>
    );
}

export default ChatRoom;
