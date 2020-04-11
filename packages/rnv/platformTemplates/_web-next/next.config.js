const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
const path = require('path');
const withTM = require('next-transpile-modules')(['renative']);

const getSourceExt = require('rnv/dist/common').getSourceExts;

const config = {
    projectRoot: path.resolve(__dirname),
    pageExtensionsRnv: getSourceExt({}, 'web-next'),
    webpack: (cfg) => {
        cfg.resolve.extensions = getSourceExt({}, 'web-next').map(e => `.${e}`);
        cfg.resolve.modules.unshift(path.resolve(__dirname));
        cfg.resolve.alias.renative = path.resolve(__dirname, 'node_modules/renative');
        cfg.module.rules[0].test = /\.(tsx|ts|js|mjs|jsx|web.js)$/;
        return cfg;
    },
};

module.exports = withExpo(withCSS(withFonts(withImages(withTM(config)))));
