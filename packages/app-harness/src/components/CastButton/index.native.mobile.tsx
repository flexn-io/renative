import React from 'react';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';

export function CastComponent() {
    const client = useRemoteMediaClient();

    if (client) {
        client.loadMedia({
            mediaInfo: {
                contentUrl: 'http://localhost:8095',
            },
        });
    }

    return <CastButton style={{ width: 24, height: 24, tintColor: 'black' }} />;
}
