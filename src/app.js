import React from 'react';
import { View } from 'react-native';
import { createNavigator, createNavigatorView, createApp } from './navigator';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import Menu from './menu';

const Navigator = createNavigator(
    { ScreenHome, ScreenMyPage }, Menu,
);

class App extends React.Component {
  static router = {
      ...Navigator.router,
      getStateForAction: (action, lastState) => Navigator.router.getStateForAction(action, lastState)
      ,
  };

  render() {
      return createNavigatorView(Navigator, this.props.navigation);
  }
}

export default createApp(App);
