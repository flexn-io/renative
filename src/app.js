import React from 'react';
import { View } from 'react-native';
import { createSwitchNavigator } from '@react-navigation/core';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import Menu from './menu';

const Stack = createSwitchNavigator(
    {
        ScreenHome,
        ScreenMyPage,
    },
);

class App extends React.Component {
  static router = {
      ...Stack.router,
      getStateForAction: (action, lastState) => Stack.router.getStateForAction(action, lastState)
      ,
  };

  render() {
      return (
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#222222' }}>
              <Menu navigation={this.props.navigation} />
              <Stack navigation={this.props.navigation} />
          </View>
      );
  }
}

export default App;
