import { useState } from "react";
import { IoClose } from "react-icons/io5";
import apiFetch from "../utils/apiFetch";

function RequestCmpt() {
    const [isRequesting, setIsRequesting] = useState(false);
    const [reqUsername, setReqUsername] = useState("");

    const sendRequest = async () => {
        if (!(reqUsername.length > 0)) {
            return;
        }

        const response = await apiFetch("/user/add", "POST", {
            reqUsername,
        });

        if (!response.ok) {
            console.log(await response.json());
        }

        setReqUsername("");
        setIsRequesting(false);
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
                        type="text"
                        name="reqUsername"
                        value={reqUsername}
                        onChange={(e) => setReqUsername(e.target.value)}
                        id="reqUsername"
                    />
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
