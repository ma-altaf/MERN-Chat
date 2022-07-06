import FormInput from "../components/FormInput";

function Home() {
    return (
        <div className="grid grid-cols-3 h-screen w-screen text-white">
            {/* description */}
            <div className="bg-primary h-full p-4">
                <h1 className="text-6xl py-4">LOGO</h1>
                <p className="text-xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fugit, similique aut. Corrupti reprehenderit perferendis,
                    accusamus asperiores, modi quod aliquid corporis porro
                    itaque quae deserunt totam? Earum reiciendis perferendis
                    commodi distinctio!
                </p>
            </div>
            {/* login form */}
            <div className="col-span-2 h-full p-4 flex flex-col justify-center items-center">
                <form className="m-4 min-w-[50%]">
                    <h1 className="mb-2 text-3xl">Create Account</h1>
                    <FormInput label="name" />
                    <FormInput label="password" inputType="password" />
                    <input
                        type="button"
                        value="submit"
                        className="px-4 py-2 bg-primary rounded uppercase my-4"
                    />
                </form>
            </div>
        </div>
    );
}

export default Home;
