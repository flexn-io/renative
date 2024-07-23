import { useEffect, useState } from 'react';
import { View } from 'react-native';
import ReactPlayer from 'react-player';

export const Player = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return <View>{isClient ? <ReactPlayer url="https://www.youtube.com/watch?v=LXb3EKWsInQ" /> : null}</View>;
};
