import { useState } from "react";

function Home() {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitForm = () => {
        // validate inputs
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 h-screen w-screen">
            {/* description */}
            <div
                id="description"
                className="h-screen col-span-2 bg-green-600 p-8 text-white"
            >
                <h1 className="text-6xl">LOGO</h1>
                <p className="text-xl my-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fugit, similique aut. Corrupti reprehenderit perferendis,
                    accusamus asperiores, modi quod aliquid corporis porro
                    itaque quae deserunt totam? Earum reiciendis perferendis
                    commodi distinctio!
                </p>
                <a
                    className="px-4 py-2 bg-white text-green-600 rounded uppercase cursor-pointer absolute bottom-0 m-4 right-0 block  md:hidden"
                    href="#formIpnut"
                >
                    register
                </a>
            </div>
            {/* login form */}
            <div
                id="formIpnut"
                className="min-h-screen p-4 flex-col justify-center items-center flex bg-white relative"
            >
                <a
                    className="px-4 py-2 uppercase cursor-pointer absolute top-0 m-4 left-0 block  md:hidden text-gray-500"
                    href="#description"
                >
                    back
                </a>

                <form className="m-4 min-w-[30%]">
                    <h1 className="mb-2 text-3xl w-fit">
                        {isLogin ? "Log In" : "Create Account"}
                    </h1>

                    {/* username input field */}
                    {!isLogin && (
                        <div className="flex items-center py-1">
                            <label className="text-gray-500" htmlFor="username">
                                Name:
                            </label>
                            <input
                                className="w-full px-2 mx-2 outline-none border-b-2 focus:border-green-600 transition-all"
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    {/* email input field */}
                    <div className="flex items-center py-1">
                        <label className="text-gray-500" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="w-full px-2 mx-2 outline-none border-b-2 focus:border-green-600 transition-all"
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* password input field */}
                    <div className="flex items-center py-1">
                        <label className="text-gray-500" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className="w-full px-2 mx-2 outline-none border-b-2 focus:border-green-600 transition-all"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type="button"
                        value="submit"
                        className="px-4 py-2 bg-green-600 rounded uppercase my-4 cursor-pointer"
                        onClick={() => submitForm}
                    />
                    <h5>
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <p
                            className="underline text-blue-500 inline-block cursor-pointer"
                            onClick={() => {
                                setUsername("");
                                setEmail("");
                                setPassword("");
                                setIsLogin((prev) => !prev);
                            }}
                        >
                            {isLogin ? "Create Account" : "Log In"}
                        </p>
                    </h5>
                </form>
            </div>
        </div>
    );
}

export default Home;
