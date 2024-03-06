import React from 'react';
import { Button } from 'react-native';
import { logDebug } from '../Logger';

export const NewModuleButton = () => {
    const onPress = () => {
        logDebug('NativeModules not supported in web');
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
