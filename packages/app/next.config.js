const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withCSS = require('@zeit/next-css');
const path = require('path');
const withTM = require('next-transpile-modules')(['renative']);

const config = {
    projectRoot: path.resolve(__dirname),
    pageExtensions: process.env.RNV_EXTENSIONS.split(','),
    distDir: process.env.NEXT_DIST_DIR,
    compress: false,
    webpack: (cfg, { isServer }) => {
        cfg.resolve.extensions = process.env.RNV_EXTENSIONS.split(',').map(e => `.${e}`).filter(ext => isServer || !ext.includes('server.'));
        cfg.resolve.modules.unshift(path.resolve(__dirname));
        cfg.module.rules[0].test = /\.(tsx|ts|js|mjs|jsx)$/;
        return cfg;
    },
};

module.exports = withExpo(withCSS(withFonts(withImages(withTM(config)))));
