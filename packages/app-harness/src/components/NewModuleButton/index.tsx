import React, { forwardRef } from 'react';
import { TouchableOpacityProps, TouchableOpacity, Text } from 'react-native';
import { useLoggerContext } from '../../context';
import styles from '../../styles';

interface ButtonProps extends TouchableOpacityProps {}
export const NewModuleButton = forwardRef<TouchableOpacity, ButtonProps>(({ onBlur, onFocus, style }, ref) => {
    const { logDebug } = useLoggerContext();
    const onPress = () => {
        logDebug('NativeModules not supported in web');
    };
    return (
        <TouchableOpacity ref={ref} onPress={onPress} onFocus={onFocus} onBlur={onBlur} style={style}>
            <Text style={styles.buttonTitle}>Click to invoke native module!</Text>
        </TouchableOpacity>
    );
});
