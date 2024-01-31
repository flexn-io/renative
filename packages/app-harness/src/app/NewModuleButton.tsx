import React from 'react';
import { NativeModules, Button } from 'react-native';

const NewModuleButton = () => {
    const { CalendarModule } = NativeModules;
    const callback = (error: any, result: string) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    };
    const onPress = () => {
        CalendarModule.createCalendarEvent('testName', 'testLocation', callback);
    };
    return <Button title="Click to invoke native module!" color="#841584" onPress={onPress} />;
};

export default NewModuleButton;
