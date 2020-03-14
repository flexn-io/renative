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

const YoutubeVideo = ({ youtubeId, title }) => (
    <div
        className="wrapper"
        style={{
            margin: 'auto'
        }}
    >
        <div
            style={{
                position: 'relative',
                paddingBottom: '56.25%' /* 16:9 */,
                height: 0
            }}
        >
            <iframe
                title={title || 'video'}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                frameBorder="0"
            />
        </div>
    </div>
);

const HomeSplash = ({ siteConfig, language = '' }) => {
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = ({ children }) => (
        <div className="homeContainer">
            <div className="homeSplashFade">
                <div className="wrapper homeWrapper">
                    {children}
                </div>
            </div>
        </div>
    );

    const ProjectTitle = () => (

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

    const Button = ({ className = 'button', href, target, children }) => (
        <div className="pluginWrapper buttonWrapper">
            <a className={className} href={href} target={target}>
                {children}
            </a>
        </div>
    );

    return (
        <SplashContainer>
as
            <div className="inner">

                <ProjectTitle siteConfig={siteConfig} img_src={`${baseUrl}img/logo_large.png`} />

                <PromoSection>
                    <Button href={docUrl('quickstart')} className="buttonDark">
Try It Out
                    </Button>
                </PromoSection>
            </div>
        </SplashContainer>
    );
};


const Index = ({ config: siteConfig, language = '' }) => {
    const { baseUrl } = siteConfig;

    const Beta = () => (
        <img src={`${baseUrl}img/beta.png`} className="beta" />
    );

    const Block = ({ id, background, children, layout }) => (
        <Container
            padding={['bottom', 'top']}
            id={id}
            background={background}
        >
            <GridBlock
                align="center"
                contents={children}
                layout={layout}
            />
        </Container>
    );

    const PlatformItem = ({ url, title }) => (
        <div>
            <a className="platformItemText" href={`${baseUrl}docs/platform-${url}`}>
                {title}
            </a>
            <img src={`${baseUrl}img/rnv_${url}.gif`} className="platformItem" />
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
        { title: 'Tizen TV', url: 'tizen' },
        { title: 'Tizen Watch', url: 'tizenwatch' },
        { title: 'Firefox OS', url: 'firefoxos' },
        { title: 'Windows', url: 'windows' },
        { title: 'macOS / OSX', url: 'macos' },
        { title: 'Android Wear', url: 'androidwear' },
        { title: 'Firefox TV', url: 'firefoxtv' },
        { title: 'KaiOS', url: 'kaios' },

    ];

    const Platforms = ({ id, background }) => (
        <Container
            padding={['bottom', 'top']}
            id={id}
            background={background}
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
              `[Target all platforms with single React Native framework](${baseUrl}docs/platforms)`,
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
              `[Too lazy to build your idea from scratch? use one of the predefined & community templates to get you started in no time.](${baseUrl}docs/guide-templates)`,
                    image: `${baseUrl}img/undraw_online_page_cq94.svg`,
                    imageAlign: 'left',
                    title: 'Templates',
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
              `[ReNative supports integration for various services and deployment infrastructures for your apps](${baseUrl}docs/integration_docker)`,
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
                        `[Tired of setting up and managing countless of various projects? you can go as simple as most basic json config file to get yourself up and running](${baseUrl}docs/guide-config)`,
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
              `[Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you](${baseUrl}docs/build_hooks)`,
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
              `[ReNative runtime is an NPM dependency used abstract away some of the complexities of building UI interfaces and features for large number of target platforms](${baseUrl}docs/guide-runtime)`,
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
              `[One CLI to do it all. rnv is your entry point and control centre to building multi-platform apps with just a few commands to learn](${baseUrl}docs/guide-cli)`,
                    image: `${baseUrl}img/rnv_cli.gif`,
                    imageAlign: 'right',
                    title: 'CLI',

                },
            ]}
        </Block>
    );


    return (
        <div>
            <HomeSplash siteConfig={siteConfig} language={language} />
            <div className="mainContainer">
                <YoutubeVideo youtubeId="PLCJzCDSyDk" title="demo" />
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
};

module.exports = Index;
