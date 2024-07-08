import React, { forwardRef } from 'react';
import { useLoggerContext } from '../../context';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import styles from '../../styles';
import { testProps } from '../../config';

type ButtonProps = TouchableOpacityProps;
export const PhotoEditorButton = forwardRef<TouchableOpacity, ButtonProps>(({ onBlur, onFocus, style }, ref) => {
    const { logDebug } = useLoggerContext();
    const handlePhotoEditor = () => {
        logDebug('PhotoEditor not supported on this platform');
    };

    return (
        <TouchableOpacity ref={ref} onPress={handlePhotoEditor} onFocus={onFocus} onBlur={onBlur} style={style}>
            <Text style={styles.buttonTitle} {...testProps('app-harness-home-request-photo-editor-button')}>
                Show PhotoEditor
            </Text>
        </TouchableOpacity>
    );
});
