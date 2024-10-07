import { Button, View } from 'react-native';
import { CastButton, CastContext } from 'react-native-google-cast';
import { testProps } from '../../config';
import { useLoggerContext } from '../../context';

export function CastComponent() {
    const { logDebug } = useLoggerContext();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <CastButton
                {...testProps('app-harness-home-cast-support-button')}
                style={{ width: 24, height: 24, tintColor: 'black' }}
            />
            <Button
                title="Load Media"
                onPress={async () => {
                    try {
                        const client = (await CastContext.getSessionManager().getCurrentCastSession())?.client;
                        if (!client) {
                            logDebug(`Cast: client is "${client}"`);
                            return;
                        }
                        await client.loadMedia({
                            mediaInfo: {
                                contentUrl:
                                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
                            },
                        });
                    } catch (e) {
                        logDebug(`Cast: ${e}`);
                    }
                }}
            />
        </View>
    );
}
