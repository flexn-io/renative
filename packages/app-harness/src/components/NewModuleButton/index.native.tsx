import React, { forwardRef } from 'react';
import { NativeModules, TouchableOpacityProps, TouchableOpacity, Text } from 'react-native';
import { useLoggerContext } from '../../context';
import styles from '../../styles';

interface ButtonProps extends TouchableOpacityProps {}
export const NewModuleButton = forwardRef<TouchableOpacity, ButtonProps>(({ onBlur, onFocus, style }, ref) => {
    const { TestNativeModule } = NativeModules;
    const { logDebug } = useLoggerContext();
    const callback = (error: any, result: string) => {
        if (error) {
            logDebug(error);
        } else {
            logDebug(result);
        }
    };
    const onPress = () => {
        if (TestNativeModule) {
            TestNativeModule.createTestEvent('testName', 'testLocation', callback);
        } else {
            logDebug('NativeModules not supported for this platform');
        }
    };
    return (
        <TouchableOpacity ref={ref} onPress={onPress} onFocus={onFocus} onBlur={onBlur} style={style}>
            <Text style={styles.buttonTitle}>Click to invoke native module!</Text>
        </TouchableOpacity>
    );
});
