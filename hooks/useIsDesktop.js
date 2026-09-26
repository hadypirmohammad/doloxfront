import { useEffect, useState } from 'react';

export function useIsDesktop(query = '(min-width: 1024px)') {
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setIsDesktop(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [query]);

    return isDesktop;
}
