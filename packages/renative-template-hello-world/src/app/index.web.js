import React from 'react';
import { View } from 'react-native';
import { Router } from '@reach/router';
import { Api } from 'renative';

import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';
import { themeStyles } from '../theme';

if (Api.engine !== 'next') {
    // bootstrap fonts for web
    require('../../platformAssets/runtime/fontManager');
}

const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative'
    }
};

const App = () => (
    <View style={[themeStyles.app]}>
        <Menu focusKey="menu" />
        <View style={styles.container}>
            <Router>
                <ScreenHome path="/" />
                <ScreenMyPage path="my-page" />
                <ScreenModal path="modal" />
            </Router>
        </View>
    </View>
);

export default App;
