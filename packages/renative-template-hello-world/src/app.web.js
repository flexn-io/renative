import React from 'react';
import { Router, createHistory, LocationProvider } from '@reach/router';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import '../platformAssets/runtime/fontManager';
import createHashSource from 'hash-source';


// listen to the browser history
const source = createHashSource();
const history = createHistory(source);

const App = () => (
    <LocationProvider history={history}>
        <div>
            <Menu />
            <Router>
                <ScreenHome default path="/" />
                <ScreenMyPage path="my-page/*" />
                <ScreenModal path="modal" />
            </Router>
        </div>
    </LocationProvider>);

export default App;
