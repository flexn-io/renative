/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
    docUrl(doc, language) {
        const { baseUrl } = this.props.config;
        const { docsUrl } = this.props.config;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        return `${baseUrl}${docsPart}${langPart}${doc}`;
    }

    pageUrl(doc, language) {
        const { baseUrl } = this.props.config;
        return baseUrl + (language ? `${language}/` : '') + doc;
    }

    render() {
        const language = ''; // this.props.language
        return (
            <footer className="nav-footer" id="footer">
                <section className="sitemap">
                    <a href={this.props.config.baseUrl} className="nav-home">
                        {this.props.config.footerIcon && (
                            <img
                                src={this.props.config.baseUrl + this.props.config.footerIcon}
                                alt={this.props.config.title}
                                width="66"
                                height="58"
                            />
                        )}
                    </a>
                    <div>
                        <h5>
Docs
                        </h5>
                        <a href={this.docUrl('installation', language)}>
              Getting Started
                        </a>
                        <a href={this.docUrl('platforms_overview', language)}>
              Platforms
                        </a>
                        <a href={this.docUrl('plugins', language)}>
              Guides
                        </a>
                    </div>
                    <div>
                        <h5>
Community
                        </h5>

                        <a href="https://spectrum.chat/renative">
Project Chat
                        </a>
                        <a
                            href="https://twitter.com/renative"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
              Twitter
                        </a>
                        <a href={`${this.props.config.baseUrl}help`}>
              Contributors
                        </a>
                    </div>
                    <div>
                        <h5>
More
                        </h5>

                        <a href="https://github.com/pavjacko/renative">
GitHub
                        </a>
                        <a
                            className="github-button"
                            href={this.props.config.repoUrl}
                            data-icon="octicon-star"
                            data-count-href="/pavjacko/renative/stargazers"
                            data-show-count="true"
                            data-count-aria-label="# stargazers on GitHub"
                            aria-label="Star this project on GitHub"
                        >
              Star
                        </a>
                        {this.props.config.twitterUsername && (
                            <div className="social">
                                <a
                                    href={`https://twitter.com/${
                                        this.props.config.twitterUsername
                                    }`}
                                    className="twitter-follow-button"
                                >
                  Follow @
                                    {this.props.config.twitterUsername}
                                </a>
                            </div>
                        )}
                        {this.props.config.facebookAppId && (
                            <div className="social">
                                <div
                                    className="fb-like"
                                    data-href={this.props.config.url}
                                    data-colorscheme="dark"
                                    data-layout="standard"
                                    data-share="true"
                                    data-width="225"
                                    data-show-faces="false"
                                />
                            </div>
                        )}
                    </div>
                </section>


                <section className="copyright">
                    {this.props.config.copyright}
                </section>
            </footer>
        );
    }
}

module.exports = Footer;
