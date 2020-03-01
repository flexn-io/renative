import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Router, createHistory, LocationProvider } from '@reach/router';
import createHashSource from 'hash-source';
import { isFactorDesktop, isFactorTv, isFactorBrowser, registerFocusManger, registerServiceWorker } from 'renative';
import ScreenHome from '../screenHome';
import ScreenMyPage from '../screenMyPage';
import ScreenModal from '../screenModal';
import Menu from '../menu';
import Theme, { hasWebFocusableUI } from '../theme';
import '../../platformAssets/runtime/fontManager';
import { initNavigation, setKeyMap } from '@noriginmedia/react-spatial-navigation';

// initNavigation();

const styles = StyleSheet.create({
    app: {
        flexDirection: isFactorDesktop ? 'row' : 'column', position: 'absolute', top: 0, right: 0, left: 0, bottom: 0
    }
});

const stylesWeb = {
    container: {
        position: 'absolute', top: Theme.menuHeight, right: 0, left: 0, bottom: 0
    }
};

const source = createHashSource();
const history = createHistory(source);
// registerFocusManger({ focused: 'opacity: 0.4' });
if (isFactorBrowser) registerServiceWorker();

// Flag to enable yellow warnings
console.disableYellowBox = true;

const App = () => (
    <LocationProvider history={history}>
        <View style={styles.app}>
            <Router primary={false}>
                <Menu path="*" focusKey="menu" />
            </Router>
            <div style={stylesWeb.container}>
                <Router>
                    <ScreenHome default path="/" />
                    <ScreenMyPage path="my-page/*" />
                    <ScreenModal path="modal" />
                </Router>
            </div>
        </View>
    </LocationProvider>);

export default App;
