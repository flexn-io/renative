import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Router, navigate } from '@reach/router';

import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';
import { themeStyles } from '../theme';

const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative'
    }
};

const App = () => {
    useEffect(() => {
        // Required for tizen
        if (window.focus) window.focus();
    }, []);

    return (
        <View style={[themeStyles.app]}>
            <Menu focusKey="menu" navigate={navigate} />
            <View style={styles.container}>
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
