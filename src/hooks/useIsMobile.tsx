import {useEffect, useState} from "react";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false); // Adjust the threshold as needed

    // @ts-ignore
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
        };

        if (typeof window !== 'undefined') {
            handleResize(); // Initial check

            window.addEventListener('resize', handleResize);

            // Cleanup the event listener on component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return isMobile;
};

export default useIsMobile;