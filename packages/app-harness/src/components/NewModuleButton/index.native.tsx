import React from 'react';
import { NativeModules, Button } from 'react-native';
import { logDebug } from '../Logger';

export const NewModuleButton = () => {
    const { TestNativeModule } = NativeModules;
    const callback = (error: any, result: string) => {
        if (error) {
            logDebug(error);
        } else {
            logDebug(result);
        }
    };
    const onPress = () => {
        TestNativeModule.createTestEvent('testName', 'testLocation', callback);
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
