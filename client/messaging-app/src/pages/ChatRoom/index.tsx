import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Message, { messageType } from "./components/Message";
import { socketContext } from "../../context/SocketContext";
import ChatRoomInfoPanel from "./components/ChatRoomInfoPanel";
import MessagingBanner from "./components/MessagingBanner";

const NUM_MSG = 10;

function ChatRoom() {
    const isMoreMsgRequested = useRef(false);
    const isMsgRequested = useRef(false);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isLastMessage, setIsLastMessage] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getPrevMsg = (messageRes: messageType[]) => {
            messageRes.reverse();
            setMessages((prev) => [...messageRes, ...prev]);
            setIsLastMessage(messageRes.length < NUM_MSG);
            isMoreMsgRequested.current = false;
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

    const getMsg = async () => {
        if (!isMoreMsgRequested.current) {
            isMoreMsgRequested.current = true;
            socket?.emit("get_msg");
        }
    };

    return (
        <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3">
            <ChatRoomInfoPanel roomID={roomID} />
            <div className="h-screen w-full col-span-2 bg-gray-100 flex flex-col justify-end">
                <div
                    className="w-full max-h-full flex flex-col overflow-y-auto px-4 relative scroll-smooth"
                    ref={messageListRef}
                >
                    {!isLastMessage && (
                        <button
                            className="bg-gray-300 rounded-lg px-2 mt-16 md:mt-1 w-fit m-1 mx-auto"
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
                <MessagingBanner
                    roomID={roomID}
                    socket={socket}
                    setMessages={setMessages}
                />
            </div>
        </div>
    );
}

export default ChatRoom;
