/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const { siteConfig, language = '' } = this.props;
        const { baseUrl, docsUrl } = siteConfig;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

        const SplashContainer = props => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">
                        {props.children}
                    </div>
                </div>
            </div>
        );

        const Logo = props => (
            <div className="projectLogo">
                <img src={props.img_src} alt="Project Logo" className="logoImage" />
            </div>
        );

        const ProjectTitle = props => (

            <div className="projectTitle">

                <h1 className="headerTitle">
ReNative
                </h1>
                <small>
                    {siteConfig.tagline}
                </small>
            </div>
        );

        const PromoSection = props => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">
                        {props.children}
                    </div>
                </div>
            </div>
        );

        const Button = props => (
            <div className="pluginWrapper buttonWrapper">
                <a className={props.className || 'button'} href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );

        return (
            <SplashContainer>

                <div className="inner">

                    <ProjectTitle siteConfig={siteConfig} img_src={`${baseUrl}img/logo_large.png`} />

                    <PromoSection>
                        <Button href={docUrl('installation.html')} className="buttonDark">
Try It Out
                        </Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;
        const { baseUrl } = siteConfig;

        const Beta = props => (
            <img src={`${baseUrl}img/beta.png`} className="beta" />
        );

        const Block = props => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}
            >
                <GridBlock
                    align="center"
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const FeatureCallout = () => (
            <div
                className="productShowcaseSection paddingBottom"
                style={{ textAlign: 'center' }}
            >
                <h2>
Feature Callout
                </h2>
                <MarkdownBlock>
These are features of this project
                </MarkdownBlock>
            </div>
        );

        const PlatformItem = props => (
            <div>
                <a className="platformItemText" href={`${baseUrl}docs/${props.url}`}>
                    {props.title}
                </a>
                <img src={`${baseUrl}img/rnv_${props.url}.gif`} className="platformItem" />
            </div>
        );

        const platformsData = [
            { title: 'iOS', url: 'ios' },
            { title: 'tvOS', url: 'tvos' },
            { title: 'Android TV', url: 'androidtv' },
            { title: 'Android', url: 'android' },
            { title: 'Web', url: 'web' },
            { title: 'LG WebOS', url: 'webos' },
            { title: 'Tizen Mobile', url: 'tizenmobile' },
            { title: 'Windows', url: 'windows' },
            { title: 'Firefox TV', url: 'firefoxtv' },
            { title: 'KaiOS', url: 'kaios' },
            { title: 'Firefox OS', url: 'firefoxos' },
            { title: 'Tizen Watch', url: 'tizenwatch' },
            { title: 'Android Wear', url: 'androidwear' }
        ];

        const Platforms = props => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}
            >
                <div className="platformsWrapper">
                    {platformsData.map(v => <PlatformItem {...v} />)}
                </div>
            </Container>
        );

        const ReactNative = () => (
            <Block id="reactNative" background="dark">
                {[
                    {
                        content:
              `[Target all platforms with single React Native framework](${baseUrl}docs/platforms_overview)`,
                        image: `${baseUrl}img/undraw_react_y7wq.svg`,
                        imageAlign: 'left',
                        title: 'React Native on Steroids',
                    },
                ]}
            </Block>
        );

        const Templates = () => (
            <Block id="try">
                {[
                    {
                        content:
              `[Too lazy to build your idea from scratch? use one of the predefined & community templates to get you started in no time.](${baseUrl}docs/templates)`,
                        image: `${baseUrl}img/undraw_online_page_cq94.svg`,
                        imageAlign: 'left',
                        title: 'Templates',
                    },
                ]}
            </Block>
        );

        const Description = () => (
            <Block background="dark">
                {[
                    {
                        content:
              'This is another description of how this project is useful',
                        image: `${baseUrl}img/undraw_note_list.svg`,
                        imageAlign: 'right',
                        title: 'Description',
                    },
                ]}
            </Block>
        );

        const Plugins = () => (
            <Block background="light">
                {[
                    {
                        content:
              `[ReNative supports standard community driven react-native plugins you can use to enhance the functionality of your apps](${baseUrl}docs/plugins)`,
                        image: `${baseUrl}img/undraw_product_teardown_elol.svg`,
                        imageAlign: 'right',
                        title: 'Plugins',
                    },
                ]}
            </Block>
        );

        const Integrations = () => (
            <Block background="light">
                {[
                    {
                        content:
              `[ReNative supports integration for various services and deployment infrastructures for your apps](${baseUrl}docs/integrations)`,
                        image: `${baseUrl}img/undraw_mobile_marketing_iqbr.svg`,
                        imageAlign: 'right',
                        title: 'Integrations',
                    },
                ]}
            </Block>
        );

        const Configurations = () => (
            <Block id="try">
                {[
                    {
                        content:
                        `[Tired of setting up and managing countless of various projects? you can go as simple as most basic json config file to get yourself up and running](${baseUrl}docs/config)`,
                        image: `${baseUrl}img/undraw_preferences_uuo2.svg`,
                        imageAlign: 'left',
                        title: 'Configurations',
                    }
                ]}
            </Block>
        );

        const BuildHooks = () => (
            <Block background="light">
                {[
                    {
                        content:
              `[Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you](${baseUrl}docs/bbuild_hooks)`,
                        image: `${baseUrl}img/undraw_convert_2gjv.svg`,
                        imageAlign: 'right',
                        title: 'Build Hooks',
                    },
                ]}
            </Block>
        );

        const Runtime = () => (
            <Block id="try">
                {[
                    {
                        content:
              `[ReNative runtime is an NPM dependency used abstract away some of the complexities of building UI interfaces and features for large number of target platforms](${baseUrl}docs/runtime)`,
                        image: `${baseUrl}img/undraw_web_devices_ad58.svg`,
                        imageAlign: 'left',
                        title: 'Runtime',
                    },
                ]}
            </Block>
        );


        const CLI = () => (
            <Block background="light">
                {[
                    {
                        content:
              `[One CLI to do it all. rnv is your entry point and control centre to building multi-platfom apps with just a few commands to learn](${baseUrl}docs/cli)`,
                        image: `${baseUrl}img/rnv_cli.gif`,
                        imageAlign: 'right',
                        title: 'CLI',

                    },
                ]}
            </Block>
        );


        const Features = () => (
            <Block layout="fourColumn">
                {[
                    {
                        content: 'This is the content of my feature',
                        image: `${baseUrl}img/undraw_react.svg`,
                        imageAlign: 'top',
                        title: 'Feature One',
                    },
                    {
                        content: 'The content of my second feature',
                        image: `${baseUrl}img/undraw_operating_system.svg`,
                        imageAlign: 'top',
                        title: 'Feature Two',
                    },
                ]}
            </Block>
        );

        const Showcase = () => {
            if ((siteConfig.users || []).length === 0) {
                return null;
            }

            const showcase = siteConfig.users
                .filter(user => user.pinned)
                .map(user => (
                    <a href={user.infoLink} key={user.infoLink}>
                        <img src={user.image} alt={user.caption} title={user.caption} />
                    </a>
                ));

            const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

            return (
                <div className="productShowcaseSection paddingBottom">
                    <h2>
Who is Using This?
                    </h2>
                    <p>
This project is used by all these people
                    </p>
                    <div className="logos">
                        {showcase}
                    </div>
                    <div className="more-users">
                        <a className="button" href={pageUrl('users.html')}>
              More
                            {' '}
                            {siteConfig.title}
                            {' '}
Users
                        </a>
                    </div>
                </div>
            );
        };

        return (
            <div>

                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="mainContainer">
                    <Platforms />
                    <ReactNative />
                    <Plugins />
                    <Templates />
                    <Integrations />
                    <Configurations />
                    <BuildHooks />
                    <Runtime />
                    <CLI />

                </div>
                <Beta />
            </div>
        );
    }
}

module.exports = Index;
