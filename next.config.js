const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
const path = require('path');
const withTM = require('next-transpile-modules')(['renative']);
const resolve = require('resolve');

const getSourceExt = require('rnv/dist/common').getSourceExts;

const config = {
    projectRoot: path.resolve(__dirname, './'),
    webpack: (cfg) => {
        cfg.resolve.extensions = getSourceExt({ platform: 'web-next' }).map(e => `.${e}`);
        cfg.resolve.modules.unshift(path.resolve(__dirname));
        cfg.resolve.alias.next = resolve.sync('@rnv/next');
        cfg.module.rules[0].include.unshift(path.resolve(__dirname, '../node_modules/renative/src'));
        cfg.module.rules[0].test = /\.(tsx|ts|js|mjs|jsx|web.js)$/;
        console.log('cfg', cfg);
        return cfg;
    },
};


module.exports = withExpo(withCSS(withFonts(withImages(withTM(config)))));
