import React from 'react';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';
import { Router, createHistory, LocationProvider, createMemorySource } from "@reach/router";
import '../platformAssets/runtime/fontManager';
import createHashSource from 'hash-source';


// listen to the browser history
let source = createHashSource();

// let source = createMemorySource('/my-page/');
let history = createHistory(source);

console.log(history);

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <LocationProvider history={history} >
        <div >
            <Menu />
            <Router>
                <ScreenHome default path="/"/>
                <ScreenMyPage path="my-page/*" />
                <ScreenModal path="modal"/>
            </Router>
        </div>
        </LocationProvider>)
    }
}

export default App;

