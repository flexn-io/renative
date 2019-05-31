const DEFAULT_CONFIG = {
    isDebug: false,
    isTestVersion: false,
    title: 'RNVApp',
    docType: '<!DOCTYPE html>',
    htmlTag: '<html lang="en">',
    contentType: '',
    metaTags: {
        viewport: 'content="width=1280"',
        'theme-color': 'content="#000000"',
    },
};

const indent = level => '    '.repeat(level);

const removeBlankLines = string => string.replace(/^\s*\n/gm, '');

const constructMetaTags = tags => Object.keys(tags).map(tag => `<meta name="${tag}" ${tags[tag]} />`);

const htmlTemp = options => {
    const config = Object.assign(DEFAULT_CONFIG, options);
    const { docType, title, metaTags, htmlTag, contentType, isDebug, isTestVersion } = config;

    const linkTags = [
        '<link rel="manifest" href="manifest.json" />',
        '<link rel="shortcut icon" href="favicon.ico" />',
        '<link rel="stylesheet" href="app.css" />',
    ];

    const titleTag = `<title>${title}</title>`;

    const noScript = '<noscript>You need to enable JavaScript to run this app.</noscript>';

    const errScript = `
        <script>window.onerror = function(err) {
            var errDiv = document.getElementById('err');
            errDiv.innerHTML += err;
        }
        </script>`;
    const errDiv = '<div id="err" style="color: red; position: absolute; top: 0; left: 0; z-index: 0;"> </div>';
    const customScripts = (config.customScripts || [])
        .map(src => `<script type="text/javascript" src="${src}"></script>`)
        .join('');
    const rootDiv = ' <div id="root" class="root"></div>';
    return removeBlankLines(`
${docType}
${htmlTag}
    <head>
        ${contentType}
        <meta charset="utf-8" />
        ${constructMetaTags({ ...metaTags, ...config.metaTags }).join(`\n${indent(2)}`)}
        ${linkTags.join(`\n${indent(2)}`)}
        ${titleTag}
        ${isDebug ? errScript : ''}
    </head>
    <body>
        ${noScript}
        ${isDebug ? errDiv : ''}
        ${rootDiv}
        ${customScripts}
    </body>
</html>`);
};

module.exports = htmlTemp;
