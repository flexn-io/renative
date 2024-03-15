import React from 'react';
import { NativeModules, Button } from 'react-native';
import { useLoggerContext } from '../../context';

export const NewModuleButton = () => {
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
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
