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
                        <Button href="#try" className="buttonDark">
Try It Out
                        </Button>
                        <Button href={docUrl('doc1.html')} className="buttonDark">
Example Link
                        </Button>
                        <Button href={docUrl('doc2.html')} className="buttonDark">
Example Link 2
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

        // const Platforms = () => (
        //     <Block layout="fourColumn">
        //         {[
        //             {
        //                 content: '',
        //                 image: `${baseUrl}img/rnv_ios.gif`,
        //                 imageAlign: 'top',
        //                 title: '',
        //             },
        //             {
        //                 content: '',
        //                 image: `${baseUrl}img/rnv_android.gif`,
        //                 imageAlign: 'top',
        //                 title: '',
        //             },
        //             {
        //                 content: '',
        //                 image: `${baseUrl}img/rnv_web.gif`,
        //                 imageAlign: 'top',
        //                 title: '',
        //             },
        //             {
        //                 content: '',
        //                 image: `${baseUrl}img/rnv_tvos.gif`,
        //                 imageAlign: 'top',
        //                 title: '',
        //             },
        //             {
        //                 content: 'The content of my second feature',
        //                 image: `${baseUrl}img/undraw_operating_system.svg`,
        //                 imageAlign: 'top',
        //                 title: 'Tizen',
        //             },
        //         ]}
        //     </Block>
        // );

        const PlatformItem = props => (
            <div>
                <div className="platformItemText">
                    {props.title}
                </div>
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

        const TryOut = () => (
            <Block id="try">
                {[
                    {
                        content:
              'To make your landing page more attractive, use illustrations! Check out '
              + '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. '
              + 'The illustrations you see on this page are from unDraw.',
                        image: `${baseUrl}img/undraw_code_review.svg`,
                        imageAlign: 'left',
                        title: 'Wonderful SVG Illustrations',
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

        const LearnHow = () => (
            <Block background="light">
                {[
                    {
                        content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
                        image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
                        imageAlign: 'right',
                        title: 'Randomly Generated Theme Colors',
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
                    <Features />
                    <FeatureCallout />
                    <LearnHow />
                    <TryOut />
                    <Description />
                    <Showcase />
                </div>
            </div>
        );
    }
}

module.exports = Index;
