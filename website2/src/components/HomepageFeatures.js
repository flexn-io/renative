import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
    {
        title: 'Any device',
        Svg: require('../../static/img/image0.svg').default,
        float: 'top',
        imageWidth: 800,
    },
    {
        title: 'Supercharged frameworks',
        Svg: require('../../static/img/image1.svg').default,
        float: 'left',
        description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
        ),
    },

    {
        title: '1000+ plugins',
        Svg: require('../../static/img/image2.svg').default,
        float: 'right',
        description: (
      <>
        ReNative supports standard community driven react-native plugins you can use to enhance the functionality of your apps
      </>
        ),
    },
    {
        title: 'Powerful templates',
        Svg: require('../../static/img/image3.svg').default,
        float: 'left',
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
    {
        title: 'Intergations',
        Svg: require('../../static/img/image4.svg').default,
        float: 'right',
        description: (
      <>
        ReNative supports integration for various services and deployment infrastructures for your apps
      </>
        ),
    },
    {
        title: 'Scalable configurations',
        Svg: require('../../static/img/image5.svg').default,
        float: 'left',
        description: (
      <>
        Tired of setting up and managing countless of various projects?
        you can go as simple as most basic json config file to get yourself up and running
      </>
        ),
    },
    {
        title: 'Build hooks',
        Svg: require('../../static/img/image6.svg').default,
        float: 'right',
        description: (
      <>
        Sometimes you need to extend CLI functionality with custom build scripts. ReNative makes this easy for you
      </>
        ),
    },
    {
        title: 'Minimalistic Runtime',
        Svg: require('../../static/img/image7.svg').default,
        float: 'left',
        description: (
      <>
        ReNative runtime is an NPM dependency used abstract away some of the complexities of building UI interfaces and features for large number of target platforms
      </>
        ),
    },
    {
        title: 'powerful CLI',
        Svg: require('../../static/img/image8.svg').default,
        float: 'right',
        description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
        ),
    },
];

const LineSvg = require('../../static/img/line.svg').default;

function Feature({ Svg, title, description, float, imageWidth = 400 }) {
    return (
        <div className={clsx('col col--6')}>
            <div className="text--center">
                <LineSvg className={styles.lineSvg} alt={title} />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>
                    {title}
                </h3>

                <div>
                    {description ? (
                        <p style={{ float, width: '50%', padding: 100 }}>
                            {description}
                        </p>
                    ) : null}

                    <div className="text--center">
                        <Svg className={styles.featureSvg} style={{ width: imageWidth }} alt={title} />
                    </div>
                </div>

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
