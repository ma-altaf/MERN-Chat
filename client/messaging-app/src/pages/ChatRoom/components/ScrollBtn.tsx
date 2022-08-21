import { IoArrowDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
    componentRef: React.RefObject<HTMLDivElement>;
};

function ScrollBtn({ componentRef }: Props) {
    const [isScrolled, setIsScrolled] = useState(false);

    // ensures scroll to bottom is only visible when the user has scrolled a bit
    if (componentRef.current) {
        componentRef.current.onscroll = (ev) => {
            if (
                componentRef.current &&
                componentRef.current?.scrollTop < -100
            ) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
    }

    return (
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
                        componentRef.current &&
                            (componentRef.current.scrollTop =
                                componentRef.current?.scrollHeight || 0);
                    }}
                >
                    <IoArrowDown />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export default ScrollBtn;
