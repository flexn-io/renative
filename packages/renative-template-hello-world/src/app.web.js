import React from 'react';
import { Router, createHistory, LocationProvider } from '@reach/router';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import Theme from './theme';
import '../platformAssets/runtime/fontManager';
import createHashSource from 'hash-source';

const styles = {
    app: { height: '100vh', backgroundColor: Theme.color1 }
};

// listen to the browser history
const source = createHashSource();
const history = createHistory(source);

const App = () => (
    <LocationProvider history={history}>
        <div style={styles.app}>
            <Menu />
            <Router>
                <ScreenHome default path="/" />
                <ScreenMyPage path="my-page/*" />
                <ScreenModal path="modal" />
            </Router>
        </div>
    </LocationProvider>);

export default App;
