import React from 'react';
import { View, Text } from 'react-native';
import { Router, LocationProvider } from '@reach/router';
// import createHashSource from 'hash-source';
import dynamic from 'next/dynamic'

// const createHashSource = dynamic(
//   () => import('hash-source'),
//   { ssr: false }
// )
// const createHistory = dynamic(
//   () => import('@reach/router'),
//   { ssr: false }
// )
import ScreenHome from '../screenHome';
// import ScreenMyPage from '../screenMyPage';
// import ScreenModal from '../screenModal';
// import Menu from '../menu';
import Theme, { hasHorizontalMenu, themeStyles } from '../theme';

const styles = {
    container: {
        position: 'absolute',
        top:  0,
        right: 0,
        left:  0,
        bottom: 0
    }
};
let history = {};
// if(createHashSource && createHistory) {
//   const source = createHashSource();
//   history = createHistory(source);
// }


const App = () => (
        <View style={[themeStyles.app]}>
          <ScreenHome />
        </View>
  );

export default App;
