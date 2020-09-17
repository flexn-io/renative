import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Router, navigate } from '@reach/router';

import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';
import { themeStyles } from '../theme';

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
