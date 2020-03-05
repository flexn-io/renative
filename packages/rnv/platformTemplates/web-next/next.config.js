const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const path = require('path');

const getSourceExt = require('rnv/dist/common').getSourceExts;

const config = {
    projectRoot: path.resolve(__dirname, '../'),
    webpack: (cfg) => {
        cfg.resolve.extensions = getSourceExt({ platform: 'web-next' }).map(e => `.${e}`);
        // console.log(JSON.stringify(cfg, null, 3));
        return cfg;
    },
};


module.exports = withExpo(withFonts(withImages(config)));
