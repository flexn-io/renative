import React from 'react';
import { useLoggerContext } from '../../context';
import { Button } from 'react-native';

export const PhotoEditorButton = () => {
    const { logDebug } = useLoggerContext();

    const handlePhotoEditor = () => {
        logDebug('PhotoEditor not supported on this platform');
    };

    return <Button onPress={handlePhotoEditor} title="Show PhotoEditor" />;
};
