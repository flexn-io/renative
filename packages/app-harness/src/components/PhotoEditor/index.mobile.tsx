import React, { useEffect } from 'react';
import { Button, Image } from 'react-native';
import { RNPhotoEditor } from 'react-native-photo-editor';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { useLoggerContext } from '../../context';
import { ICON_LOGO } from '../../config';

export const PhotoEditorButton = () => {
    const { logDebug } = useLoggerContext();
    const photoPath = RNFS.DocumentDirectoryPath + ICON_LOGO;
    useEffect(() => {
        const fetchAndMovePhoto = async () => {
            const binaryFile = Image.resolveAssetSource(ICON_LOGO);
            try {
                const resp = await RNFetchBlob.config({ fileCache: true }).fetch('GET', binaryFile.uri);
                if (await RNFS.exists(photoPath)) {
                    await RNFS.unlink(photoPath);
                }
                await RNFS.moveFile(resp.path(), photoPath);
                logDebug('FILE WRITTEN!');
            } catch (error) {
                logDebug(`${error}`);
            }
        };
        fetchAndMovePhoto();
    }, []);
    const handlePhotoEditor = () => {
        RNPhotoEditor.Edit({
            path: photoPath,
            onDone: () => {
                logDebug('on done');
            },
            onCancel: () => {
                logDebug('on cancel');
            },
        });
    };
    return <Button onPress={handlePhotoEditor} title="Show PhotoEditor" />;
};
