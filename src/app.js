import React from 'react'
import { Text, View } from 'react-native'

class App extends React.Component {
  render () {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7777FF'}}>
      <Text>Hello World from React!</Text>
    </View>
  }
}

export default App
