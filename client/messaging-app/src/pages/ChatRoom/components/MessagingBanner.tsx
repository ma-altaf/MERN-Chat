import { ChangeEvent, useContext, useState } from "react";
import { IoAttach, IoImage, IoVideocam, IoMusicalNotes } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { authcontext } from "../../../context/AuthContext";
import { messageType, MsgContentType } from "./Message";

type Props = {
    roomID: string | undefined;
    socket: Socket | undefined;
    setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
};

function MessagingBanner({ roomID, socket, setMessages }: Props) {
    const [user] = useContext(authcontext);
    const [message, setMessage] = useState<string>("");
    const [isAttachPanelVisible, setIsAttachPanelVisible] = useState(false);

    const createMsg = (content: string, type: MsgContentType): messageType => ({
        content,
        sender: { username: user?.username || "" },
        type: type,
        roomID: roomID!,
        createdAt: new Date().toISOString(),
    });

    const sendTextMsg = () => {
        // do not send the message if there is no text content
        if (message.length === 0) {
            return;
        }
        const newMsg = createMsg(message, "text");
        socket?.emit("send_msg", newMsg);

        // clear message text input on message submission
        setMessage("");

        // display message locally
        setMessages((prev: messageType[]) => [...prev, newMsg]);
    };

    const sendFileMsg = async (
        e: ChangeEvent<HTMLInputElement>,
        msgType: MsgContentType
    ) => {
        const files = e.target.files;
        if (!files) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const newMsg = createMsg("", msgType);

            const file = new FileReader();
            file.readAsDataURL(files[i]);

            file.onloadend = () => {
                socket?.emit("send_msg", { ...newMsg, content: file.result });
            };
        }
    };

    return (
        <span className="flex justify-between bottom-0 z-10 bg-gray-100 p-2 relative">
            <span className="bg-white flex rounded-lg shadow w-full relative">
                <input
                    autoComplete="off"
                    className=" px-2 py-1 w-full rounded-lg"
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className="uppercase px-2 py-1 ml-1 bg-gray-300 rounded-lg"
                    onClick={() => setIsAttachPanelVisible((prev) => !prev)}
                >
                    <IoAttach />
                </button>
                {isAttachPanelVisible && (
                    <div className="bg-gray-200 p-1 rounded-lg absolute top-0 right-0 w-fit flex flex-col flex-wrap justify-evenly -translate-y-[100%]">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => sendFileMsg(e, "image")}
                            id="getImgBtn"
                            accept="image/*"
                            multiple
                        />
                        <label
                            className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                            htmlFor="getImgBtn"
                        >
                            <IoImage />
                            <p className="ml-3">Image</p>
                        </label>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => sendFileMsg(e, "video")}
                            id="getVidBtn"
                            accept="video/*"
                            multiple
                        />
                        <label
                            htmlFor="getVidBtn"
                            className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                        >
                            <IoVideocam />
                            <p className="ml-3">Video</p>
                        </label>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => sendFileMsg(e, "audio")}
                            id="getAudioBtn"
                            accept="audio/*"
                            multiple
                        />
                        <label
                            htmlFor="getAudioBtn"
                            className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                        >
                            <IoMusicalNotes />
                            <p className="ml-3">Audio</p>
                        </label>
                    </div>
                )}
            </span>

            <button
                className="uppercase px-2 py-1 ml-1 bg-black text-white rounded-lg"
                onClick={sendTextMsg}
            >
                send
            </button>
        </span>
    );
}

export default MessagingBanner;
