import { useEffect, useState } from "react";
import { User } from "../../../context/AuthContext";
import apiFetch from "../../../utils/apiFetch";
import EditableProfileImg from "./EditableProfileImg";

type Props = {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User>> | undefined;
    setIsEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProfile({ user, setUser, setIsEditProfile }: Props) {
    const [newUsername, setNewUsername] = useState("");
    const [newAbout, setNewAbout] = useState("");

    useEffect(() => {
        setNewUsername(user?.username || "");
        setNewAbout(user?.about || "");

        return;
    }, [user]);

    const changeName = async () => {
        const res = await apiFetch("/users/changeUsername", "POST", {
            newUsername,
        });

        if (res.ok) {
            setUser?.((prev) => ({ ...prev, username: newUsername }));
            setIsEditProfile(false);
        } else {
            setNewUsername(user?.username || "");
            window.alert(
                "Username could not be changed. The username might not be available."
            );
        }
    };

    const changeAbout = async () => {
        const res = await apiFetch("/users/changeAbout", "POST", {
            newAbout,
        });

        if (res.ok) {
            setUser?.((prev) => ({ ...prev, about: newAbout }));
            setIsEditProfile(false);
        } else {
            setNewAbout(user?.about || "");
            window.alert("About could not be changed.");
        }
    };

    return (
        <div
            className="fixed top-0 left-0 flex justify-center items-center z-50 w-screen h-screen m-0 p-0 bg-black bg-opacity-80"
            onClick={() => setIsEditProfile(false)}
        >
            <div
                className="flex flex-col justify-center items-start rounded-lg max-w-[90%] md:max-w-1/2 h-fit max-h-[95%] overflow-y-auto bg-white dark:bg-gray-800 p-1 md:p-3"
                onClick={(e) => e.stopPropagation()}
            >
                <EditableProfileImg />
                <span className="p-1">
                    <label htmlFor="newUsername">Name:</label>
                    <input
                        type="text"
                        name="newUsername"
                        id="newUsername"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="outline outline-2 rounded-lg p-1 mx-3 focus:outline-emerald-400 bg-transparent"
                    />
                    <button
                        className="bg-emerald-400 transition-colors hover:bg-emerald-600 outline outline-emerald-400 hover:outline-emerald-600 rounded-lg text-white px-2 py-1 mt-3"
                        onClick={changeName}
                    >
                        Rename
                    </button>
                </span>
                <span className="p-1 flex flex-col">
                    <label htmlFor="newAbout">About:</label>
                    <textarea
                        className="outline outline-2 rounded-lg p-2 mt-1 focus:outline-emerald-400 bg-transparent w-full"
                        name="newAbout"
                        id="newAbout"
                        cols={80}
                        rows={8}
                        onChange={(e) => setNewAbout(e.target.value)}
                        value={newAbout}
                    />
                    <button
                        className="bg-emerald-400 transition-colors hover:bg-emerald-600 rounded-lg text-white px-2 py-1 mt-3 outline outline-emerald-400 hover:outline-emerald-600"
                        onClick={changeAbout}
                    >
                        Change About
                    </button>
                    <button
                        className="bg-gray-200 px-2 py-1 rounded-lg mt-3 dark:bg-gray-900 outline outline-gray-200 dark:outline-gray-900"
                        onClick={() => setIsEditProfile(false)}
                    >
                        Close
                    </button>
                </span>
            </div>
        </div>
    );
}

export default EditProfile;
