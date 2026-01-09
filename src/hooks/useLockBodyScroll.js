import { useLayoutEffect } from 'react';

const useLockBodyScroll = (isOpen = true) => {
    useLayoutEffect(() => {
        if (!isOpen) return;

        // Get original body overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';

        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isOpen]); // Re-run if isOpen changes
};

export default useLockBodyScroll;
