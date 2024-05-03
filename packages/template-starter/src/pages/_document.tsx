import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { CONFIG } from '../config';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content={CONFIG.welcomeMessage} />
                    <link rel="icon" href="/images/favicon.ico" sizes="any" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
