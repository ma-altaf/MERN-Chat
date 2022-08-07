import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../../utils/apiFetch";

function RequestCmpt() {
    const [isRequesting, setIsRequesting] = useState(false);
    const [reqUsername, setReqUsername] = useState("");
    const [errorMessage, setErorMessage] = useState("");
    const navigate = useNavigate();

    const sendRequest = async () => {
        setErorMessage("");
        if (!(reqUsername.length > 0)) {
            return setErorMessage("No username entered");
        }

        const response = await apiFetch("/user/add", "POST", {
            reqUsername,
        });

        if (!response.ok) {
            const { error } = await response.json();
            return setErorMessage(error);
        } else {
            navigate(`/chat_room/${await response.text()}`);
        }
    };

    return (
        <div className="m-4 rounded-lg overflow-hidden bg-black text-white flex justify-center items-center">
            {isRequesting ? (
                <div className="p-4 flex flex-col justify-center">
                    <span className="flex items-center w-full">
                        <button
                            className="p-1 mr-1"
                            onClick={() => {
                                setReqUsername("");
                                setIsRequesting(false);
                                setErorMessage("");
                            }}
                        >
                            <IoClose />
                        </button>
                        <label
                            className="w-full text-center"
                            htmlFor="reqUsername"
                        >
                            Enter the name of the user
                        </label>
                    </span>
                    <input
                        className="bg-transparent border-b-2 outline-none w-full my-2 p-1 text-center"
                        style={{
                            borderBottomColor: errorMessage
                                ? "rgb(239 68 68)"
                                : "white",
                        }}
                        type="text"
                        name="reqUsername"
                        value={reqUsername}
                        onChange={(e) => setReqUsername(e.target.value)}
                        id="reqUsername"
                    />
                    {errorMessage && (
                        <p className="w-full -mt-2 mb-2 text-center text-red-500">
                            {errorMessage}
                        </p>
                    )}
                    <button
                        onClick={sendRequest}
                        className="text-black bg-white py-2 px-4 rounded-lg"
                    >
                        Send Request
                    </button>
                </div>
            ) : (
                <button
                    className="py-2 px-4"
                    onClick={() => setIsRequesting(true)}
                >
                    Add contact
                </button>
            )}
        </div>
    );
}

export default RequestCmpt;
