/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const { Container } = CompLibrary;
const { GridBlock } = CompLibrary;

function Help(props) {
    const { config: siteConfig, language = '' } = props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const supportLinks = [
        {
            content: `Learn more using the [documentation on this site.](${docUrl(
                'intro-installation',
            )})`,
            title: 'Browse Docs',
        },
        {
            content: '[Ask questions about the documentation and project](https://spectrum.chat/renative)',
            title: 'Join the community',
        },
        {
            content: '[Check out the current progress and help make ReNative better](https://github.com/pavjacko/renative/issues)',
            title: 'Stay up to date',
        },
    ];

    return (
        <div className="docMainWrapper wrapper">
            <Container className="mainContainer documentContainer postContainer">
                <div className="post">
                    <header className="postHeader">
                        <h1>
Need help?
                        </h1>
                    </header>
                    <p>
This project is maintained by a dedicated group of people.
                    </p>
                    <img src="https://opencollective.com/renative/contributors.svg?width=890" />
                    <GridBlock contents={supportLinks} layout="threeColumn" />
                </div>
            </Container>
        </div>
    );
}

module.exports = Help;
