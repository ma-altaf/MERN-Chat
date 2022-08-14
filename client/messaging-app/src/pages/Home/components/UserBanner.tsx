import { User } from "../../../context/AuthContext";
import { IoExit, IoCreateOutline } from "react-icons/io5";
import apiFetch from "../../../utils/apiFetch";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./EditProfile";
import defaultPPImg from "../../../assets/defaultPP.jpg";
import { motion } from "framer-motion";

type Props = {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User>> | undefined;
};
function UserBanner({ user, setUser }: Props) {
    const navigate = useNavigate();
    const [isEditProfile, setIsEditProfile] = useState(false);

    const logOut = async () => {
        if (window.confirm("Confirm log out")) {
            const res = await apiFetch("/users/logout");
            if (res.ok) {
                setUser !== undefined &&
                    setUser({ username: "", avatarURL: "", about: "" });
                navigate("/");
            } else {
                alert("Could not log out");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-1/2 rounded-lg p-8 shadow bg-primary-light-white dark:bg-primary-dark-gray flex justify-center items-center flex-col lg:flex-row relative"
        >
            {isEditProfile && (
                <EditProfile
                    user={user}
                    setUser={setUser}
                    setIsEditProfile={setIsEditProfile}
                />
            )}
            <span className="absolute top-0 right-0 m-1 p-1 text-2xl">
                <button
                    onClick={() => setIsEditProfile(true)}
                    title="Click to edit profile"
                    className="hover:text-accent-base transition-colors"
                >
                    <IoCreateOutline />
                </button>
                <button
                    onClick={logOut}
                    title="Click to log out"
                    className="hover:text-accent-base transition-colors"
                >
                    <IoExit />
                </button>
            </span>
            <img
                className="w-48 rounded-full aspect-square object-cover cursor-pointer"
                src={user?.avatarURL || defaultPPImg}
                alt="current user"
                title="Click to edit profile"
                onClick={() => setIsEditProfile(true)}
            />
            <div className="w-full h-full mx-4">
                <h1
                    className="mx-auto w-fit lg:m-0 my-2 text-3xl cursor-pointer"
                    title="Click to edit profile"
                    onClick={() => setIsEditProfile(true)}
                >
                    {user?.username || ""}
                </h1>
                <p
                    className="cursor-pointer w-fit"
                    title="Click to edit profile"
                    onClick={() => setIsEditProfile(true)}
                >
                    {user?.about || ""}
                </p>
            </div>
        </motion.div>
    );
}

export default UserBanner;
