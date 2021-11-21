import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                {/* <h1 className="hero__title">
                    {siteConfig.title}
                </h1> */}
                <div className="container-in">
                    <p className="hero__title">
                        {'Unified'}
                    </p>
                    <p className="hero__title hero__title_alt">
                        {'Development'}
                    </p>
                    <p className="hero__title">
                        {'Platform'}
                    </p>
                </div>

                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro"
                    >
            Try it out
                    </Link>
                </div>
                <p>
                  ReNative allows you build apps and scalable products via single development environment

                </p>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
