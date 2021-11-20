import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
    {
        title: 'on steroids',
        Svg: require('../../static/img/image1.svg').default,
        description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
        ),
    },
    {
        title: 'with plugins',
        Svg: require('../../static/img/image2.svg').default,
        description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>
docs
      </code> directory.
      </>
        ),
    },
    {
        title: 'templates',
        Svg: require('../../static/img/image3.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'intergations',
        Svg: require('../../static/img/image4.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'configurations',
        Svg: require('../../static/img/image5.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'build hooks',
        Svg: require('../../static/img/image6.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'runtime',
        Svg: require('../../static/img/image7.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'CLI',
        Svg: require('../../static/img/image8.svg').default,
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
];

const LineSvg = require('../../static/img/line.svg').default;

function Feature({ Svg, title, description }) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <LineSvg className={styles.lineSvg} alt={title} />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>
                    {title}
                </h3>
                <p>
                    {description}
                </p>
            </div>
            <div className="text--center">
                <Svg className={styles.featureSvg} alt={title} />
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                {FeatureList.map((props, idx) => (
                    <Feature key={idx} {...props} />
                ))}

            </div>
        </section>
    );
}

// export default function HomepageFeatures() {
//     return (
//         <section className={styles.features}>
//             <div className="container">
//                 <div className="row">
//                     {FeatureList.map((props, idx) => (
//                         <Feature key={idx} {...props} />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }
