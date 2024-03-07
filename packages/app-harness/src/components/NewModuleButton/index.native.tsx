import React from 'react';
import { NativeModules, Button } from 'react-native';

export const NewModuleButton = ({ handleLogs }) => {
    const { TestNativeModule } = NativeModules;
    const callback = (error: any, result: string) => {
        if (error) {
            handleLogs(error);
        } else {
            handleLogs(result);
        }
    };
    const onPress = () => {
        if (TestNativeModule) {
            TestNativeModule.createTestEvent('testName', 'testLocation', callback);
        } else {
            handleLogs('NativeModules not supported for this platform');
        }
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
