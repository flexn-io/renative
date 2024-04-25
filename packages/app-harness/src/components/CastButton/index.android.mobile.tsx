import React, { useEffect } from 'react';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';

export function CastComponent() {
    const client = useRemoteMediaClient();

    useEffect(() => {
        if (client) {
            client.loadMedia({
                mediaInfo: {
                    contentUrl:
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
                },
            });
        }
    }, [client]);

    return <CastButton style={{ width: 24, height: 24, tintColor: 'black' }} />;
}
