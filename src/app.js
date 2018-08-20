import React from 'react'
import { Text, View } from 'react-native'
import packageJson from '../package.json';

class App extends React.Component {
  render () {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7777FF'}}>
      <Text>Hello from React Native Vanilla {packageJson.version}!</Text>
    </View>
  }
}

export default App
