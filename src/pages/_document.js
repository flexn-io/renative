import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { AppRegistry } from 'react-native-web';

let index = 0;

const normalizeNextElements = `
@font-face {
    font-family: TimeBurner;
    src: url(${require('../../projectConfig/fonts/TimeBurner.ttf')});
  }

  body > div:first-child,
  #__next {
    height: 100%;
  }
`;

export default class MyDocument extends Document {
    static async getInitialProps({ renderPage }) {
        AppRegistry.registerComponent('Main', () => Main);
        const { getStyleElement } = AppRegistry.getApplication('Main');
        const page = renderPage();
        const styles = [
            <style
                key={index++}
                dangerouslySetInnerHTML={{ __html: normalizeNextElements }}
            />,
            getStyleElement()
        ];
        return { ...page, styles };
    }

    render() {
        return (
            <html style={{ height: '100%', width: '100%' }}>
                <Head />
                <body style={{ height: '100%', width: '100%' }}>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
