import React from 'react';
import { View, Text } from 'react-native';
import { Api } from 'renative';

let AppContainer;

const Tile = ({children, title}) => {
  return (
    <View>
      <Text>{title}</View>
      <View>
      {children}
      </View>
    </View>
  )
}

class App extends React.Component {
    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text>
                    {'This is kitchen sink app'}
                </Text>
                <Text>
                    {`platform: ${Api.platform}`}
                </Text>
                <Text>
                    {`factor: ${Api.formFactor}`}
                </Text>
            </View>
            <Tile><Text>BBOOO</Text></Tile>
        );
    }
}

export default App;
