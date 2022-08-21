import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Message, { messageType } from "./components/Message";
import { socketContext } from "../../context/SocketContext";
import ChatRoomInfoPanel from "./components/ChatRoomInfoPanel";
import MessagingBanner from "./components/MessagingBanner";
import { IoArrowDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const NUM_MSG = 10;

function ChatRoom() {
    const isMoreMsgRequested = useRef(false);
    const isMsgRequested = useRef(false);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isLastMessage, setIsLastMessage] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getPrevMsg = (messageRes: messageType[]) => {
            setMessages((prev) => [...prev, ...messageRes]);
            setIsLastMessage(messageRes.length < NUM_MSG);
            isMoreMsgRequested.current = false;
        };

        const newMsg = (msg: messageType) =>
            setMessages((prev) => [msg, ...prev]);

        socket?.on("joined", getPrevMsg);

        socket?.on("receive_msg", newMsg);

        socket?.on("get_msg", getPrevMsg);

        if (socket && !isMsgRequested.current) {
            isMsgRequested.current = true;
            socket?.emit("join_room", roomID);
        }

        return () => {
            socket?.off("joined", getPrevMsg);
            socket?.off("receive_msg", newMsg);
            socket?.off("get_msg", getPrevMsg);
        };
    }, [socket]);

    const getMsg = () => {
        if (!isMoreMsgRequested.current) {
            isMoreMsgRequested.current = true;
            socket?.emit("get_msg");
        }
    };

    // ensures scroll to bottom is only visible when the user has scrolled a bit
    if (messageListRef.current) {
        messageListRef.current.onscroll = (ev) => {
            if (
                messageListRef.current &&
                messageListRef.current?.scrollTop < -100
            ) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
    }

    return (
        <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3">
            <ChatRoomInfoPanel roomID={roomID} />

            <div className="h-screen w-full col-span-2 flex flex-col justify-end">
                <div
                    className="w-full max-h-full flex flex-col-reverse overflow-y-auto px-4 relative scroll-smooth pt-16 md:pt-1"
                    ref={messageListRef}
                >
                    {messages.map((msg: messageType, i) => (
                        <Message key={i} message={msg} />
                    ))}

                    {!isLastMessage && (
                        <button
                            className="bg-primary-light-deepGray dark:bg-primary-dark-lightGray rounded-lg px-2 w-fit m-1 mx-auto"
                            onClick={getMsg}
                        >
                            Load more
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isScrolled && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ borderRadius: "99px" }}
                            className="absolute z-50 bottom-12 right-4 md:right-8 mr-auto my-2 p-4 bg-primary-light-deepGray dark:bg-primary-dark-lightGray rounded-lg w-fit"
                            title="Click to scroll to bottom"
                            onClick={() => {
                                messageListRef.current &&
                                    (messageListRef.current.scrollTop =
                                        messageListRef.current?.scrollHeight ||
                                        0);
                            }}
                        >
                            <IoArrowDown />
                        </motion.button>
                    )}
                </AnimatePresence>

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
