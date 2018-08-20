import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import packageJson from '../package.json'

const styles = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7777FF'
  },
  text: {
    fontSize: 20
  }
})

class App extends React.Component {
  render () {
    return <View style={styles.app}>
      <Text style={styles.text}>Hello from React Native Vanilla {packageJson.version}!</Text>
    </View>
  }
}

export default App
