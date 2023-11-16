import { useEffect, useRef } from 'react';
import easeInOutCubic from './ease-in-out-cubic';

const animatedScrollTo = (scrollTo: any, duration: any, callback: any) => {
    const scrollFrom = useRef(window.scrollY || window.pageYOffset || 0);
    const currentTime = useRef(0);
    const increment = 20;

    useEffect(() => {
        const scrollDiff = scrollTo - scrollFrom.current;

        const animateScroll = () => {
            currentTime.current += increment;
            const newScrollPos = easeInOutCubic(currentTime.current, scrollFrom.current, scrollDiff, duration);

            window.scrollTo(0, newScrollPos);

            if (currentTime.current > duration) {
                callback();
                return;
            }

            setTimeout(animateScroll, increment);
        };

        animateScroll();

        return () => {
            currentTime.current = 0;
        };
    }, [scrollTo, duration, callback]);

    return null;
};

export default animatedScrollTo;