import React from 'react';
import { View } from 'react-native';
import { Router, createHistory, LocationProvider } from '@reach/router';
import createHashSource from 'hash-source';
import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';
import Theme, { hasHorizontalMenu, themeStyles } from '../theme';

const styles = {
    container: {
        position: 'absolute',
        top: hasHorizontalMenu ? Theme.menuHeight : 0,
        right: 0,
        left: hasHorizontalMenu ? 0 : Theme.menuWidth,
        bottom: 0
    }
};

const source = createHashSource();
const history = createHistory(source);

const App = () => (
    <LocationProvider history={history}>
        <View style={themeStyles.app}>
            <Router primary={false}>
                <Menu path="*" focusKey="menu" />
            </Router>
            <div style={styles.container}>
                <Router>
                    <ScreenHome default path="/" />
                    <ScreenMyPage path="my-page/*" />
                    <ScreenModal path="modal" />
                </Router>
            </div>
        </View>
    </LocationProvider>);

export default App;
