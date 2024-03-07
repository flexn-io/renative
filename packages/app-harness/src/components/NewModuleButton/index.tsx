import React from 'react';
import { Button } from 'react-native';

export const NewModuleButton = ({ handleLogs }) => {
    const onPress = () => {
        handleLogs('NativeModules not supported in web');
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
