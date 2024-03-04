import React from 'react';
import { Button } from 'react-native';

export const NewModuleButton = () => {
    const onPress = () => {
        console.log('NativeModules not supported in web');
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
