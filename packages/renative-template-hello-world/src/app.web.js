import React from 'react';
import { View } from 'react-native';
import { Router, createHistory, LocationProvider } from '@reach/router';
import createHashSource from 'hash-source';
import { isFactorDesktop } from 'renative';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import Theme from './theme';
import '../platformAssets/runtime/fontManager';

const styles = {
    app: { height: '100vh', width: '100vw', flexDirection: isFactorDesktop ? 'row' : 'column' },
    container: { height: '100%', width: '100%', backgroundColor: Theme.color1 }
};

const source = createHashSource();
const history = createHistory(source);

const App = () => (
    <LocationProvider history={history}>
        <View style={styles.app}>
            <Router primary={false}>
                <Menu path="*" />
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
