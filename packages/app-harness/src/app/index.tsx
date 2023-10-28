import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider, ThemeContext } from '../config';

const App = () => (
    <ThemeProvider>
        <AppThemed />
    </ThemeProvider>
);

const AppThemed = () => {
    const { theme }: any = useContext(ThemeContext);

    return (
        <View style={theme.styles.container}>
            <Text style={theme.styles.buttonText}>ReNative Harness</Text>
        </View>
    );
};

export default App;
