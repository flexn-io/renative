import React from 'react';
import { useRouter } from 'next/router';
import { View } from 'react-native';
import Menu from '../components/menu';
import { themeStyles } from '../config';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return (
      <>
          <Menu focusKey="menu" router={router} />
          <View style={themeStyles.appContainer}>
              <Component {...pageProps} />
          </View>
      </>
    );
}
