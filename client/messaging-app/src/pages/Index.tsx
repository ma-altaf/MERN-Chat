import landingImg from "../assets/landingImg.jpg";
import { useState } from "react";
import apiFetch from "../utils/apiFetch";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authcontext } from "../context/AuthContext";
import { socketContext } from "../context/SocketContext";
import { AnimatePresence, motion } from "framer-motion";

function Index() {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useContext(authcontext);
    const [socket, getSocket] = useContext(socketContext);

    const submitForm = async () => {
        // reset the error message
        setErrorMessage("");

        if (email.length === 0) {
            return setErrorMessage("No email provided");
        } else if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            return setErrorMessage("Email provided has an incorrect format");
        }

        if (password.length === 0) {
            return setErrorMessage("No password provided");
        }

        if (isLogin) {
            try {
                const user = await apiFetch("/users/login", "POST", {
                    email,
                    password,
                });

                if (!user.ok) {
                    return setErrorMessage((await user.json()).error);
                }

                setUser!(await user.json());
            } catch (error) {
                return setErrorMessage("Network error");
            }
        } else {
            if (username.length === 0) {
                return setErrorMessage("No name provided");
            }

            if (password !== confirmPassword) {
                return setErrorMessage("Passwords do not match");
            }

            try {
                const user = await apiFetch("/users/create", "POST", {
                    username,
                    email,
                    password,
                });

                if (!user.ok) {
                    const error: string = (await user.json()).error;
                    if (error) {
                        if (error.startsWith("E11000")) {
                            return setErrorMessage(
                                "Username/Email is not available"
                            );
                        } else {
                            return setErrorMessage(error);
                        }
                    }
                }

                setUser!(await user.json());
            } catch (error) {
                return setErrorMessage("Network error");
            }
        }

        // either created an account or logged in
        getSocket(true);
        navigate("/home");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen w-screen">
            {user!.username && <Navigate to={"/home"} />}
            {/* description */}
            <div
                id="description"
                className="h-screen col-span-2 text-white p-8 object-cover bg-fixed bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url(${landingImg})`,
                }}
            >
                <span className="flex flex-col items-center justify-center">
                    <motion.h1
                        initial={{ opacity: 0, translateY: "25%" }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-6xl"
                    >
                        MERN Chat
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, translateY: "25%" }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="text-xl my-4"
                    >
                        Keep in touch with friends and family!
                    </motion.p>
                    <motion.a
                        initial={{ opacity: 0, translateY: "25%" }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="px-4 py-2 bg-accent-base transition-colors hover:bg-accent-deep rounded-lg uppercase cursor-pointer md:hidden"
                        href="#formIpnut"
                    >
                        register
                    </motion.a>
                </span>
            </div>
            {/* login form */}
            <div
                id="formIpnut"
                className="min-h-screen w-full p-4 flex-col justify-center items-center flex relative bg-primary-light-white dark:bg-primary-dark-deepGray"
            >
                <a
                    className="px-4 py-2 uppercase cursor-pointer absolute top-0 m-4 left-0 block  md:hidden text-gray-500"
                    href="#description"
                >
                    back
                </a>
                <motion.form
                    transition={{ duration: 0.3, delay: 0.3 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    layout
                    className="w-full p-6"
                >
                    <motion.h1
                        layout
                        key={`${isLogin}`}
                        className="mb-2 text-3xl text-accent-base w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isLogin ? "Log In" : "Create Account"}
                    </motion.h1>

                    {errorMessage && (
                        <div className="bg-warning-light p-2 my-2 rounded-lg w-full">
                            {errorMessage}
                        </div>
                    )}

                    {/* username input field */}
                    <AnimatePresence initial={false}>
                        {!isLogin && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ type: "keyframes" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <label
                                    className="text-gray-500"
                                    htmlFor="username"
                                >
                                    Name:
                                </label>
                                <input
                                    className="w-full outline-none border-b-2 focus:border-black dark:focus:border-accent-base transition-all bg-transparent"
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* email input field */}
                    <motion.div layout>
                        <label className="text-gray-500" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="w-full outline-none border-b-2 focus:border-black dark:focus:border-accent-base transition-all bg-transparent"
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>

                    {/* password input field */}
                    <motion.div layout>
                        <label className="text-gray-500" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className="w-full outline-none border-b-2 focus:border-black dark:focus:border-accent-base transition-all bg-transparent"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </motion.div>

                    <AnimatePresence initial={false}>
                        {!isLogin && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ type: "keyframes" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <label
                                    className="text-gray-500"
                                    htmlFor="confirm_password"
                                >
                                    Confirm Password:
                                </label>
                                <input
                                    className="w-full outline-none border-b-2 focus:border-black dark:focus:border-accent-base transition-all bg-transparent"
                                    type="password"
                                    name="password"
                                    id="confirm_password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.input
                        layout
                        type="button"
                        value="submit"
                        className="px-4 py-2 bg-accent-base transition-colors hover:bg-accent-deep text-white rounded-lg uppercase my-4 cursor-pointer"
                        onClick={() => submitForm()}
                    />
                    <motion.h5
                        key={`${isLogin}Link`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <p
                            className="underline inline-block cursor-pointer text-accent-base"
                            onClick={() => {
                                setUsername("");
                                setEmail("");
                                setPassword("");
                                setConfirmPassword("");
                                setErrorMessage("");
                                setIsLogin((prev) => !prev);
                            }}
                        >
                            {isLogin ? "Create Account" : "Log In"}
                        </p>
                    </motion.h5>
                </motion.form>
            </div>
        </div>
    );
}

export default Index;
