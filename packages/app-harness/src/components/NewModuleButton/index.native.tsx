import React from 'react';
import { NativeModules, Button } from 'react-native';

export const NewModuleButton = () => {
    const { TestNativeModule } = NativeModules;
    const callback = (error: any, result: string) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    };
    const onPress = () => {
        TestNativeModule.createTestEvent('testName', 'testLocation', callback);
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
