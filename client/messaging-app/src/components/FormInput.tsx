function FormInput({ label = "", hint = "", inputType = "text" }) {
    return (
        <div className="w-full flex items-center uppercase border-b-2 my-3">
            <label className="mr-2" htmlFor={label}>
                {label + ":"}
            </label>
            <input
                className="py-1 px-1 focus:outline-none w-full"
                type={inputType}
                name={label}
                id={label}
                placeholder={hint}
            />
        </div>
    );
}

export default FormInput;
