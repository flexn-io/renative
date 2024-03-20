import React from 'react';
import { Button } from 'react-native';
import { useLoggerContext } from '../../context';

export const NewModuleButton = () => {
    const { logDebug } = useLoggerContext();
    const onPress = () => {
        logDebug('NativeModules not supported in web');
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};
