import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Router, navigate } from '@reach/router';
import Menu from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';
import { themeStyles } from '../config';

const App = () => {
    useEffect(() => {
        // Required for tizen
        if (window.focus) window.focus();
    }, []);

    return (
        <View style={themeStyles.app}>
            <Menu focusKey="menu" navigate={navigate} />
            <View style={themeStyles.appContainer}>
                <Router>
                    <ScreenHome path="/" />
                    <ScreenMyPage path="my-page" />
                    <ScreenModal path="modal" />
                </Router>
            </View>
        </View>
    );
};

export default App;
