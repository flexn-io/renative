import React from 'react';
import { View } from 'react-native';
import { Router, createHistory, LocationProvider } from '@reach/router';
import createHashSource from 'hash-source';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import Theme from './theme';
import '../platformAssets/runtime/fontManager';

const styles = {
    app: { height: '100vh', backgroundColor: Theme.color1, flexDirection: 'column' }
};

// listen to the browser history
const source = createHashSource();
const history = createHistory(source);

const App = () => (
    <LocationProvider history={history}>
        <View style={styles.app}>
            <Router primary={false}>
                <Menu path="*" style={{ flexDirection: 'row' }} />
            </Router>
            <Router>
                <ScreenHome default path="/" />
                <ScreenMyPage path="my-page/*" />
                <ScreenModal path="modal" />
            </Router>
        </View>
    </LocationProvider>);

export default App;
