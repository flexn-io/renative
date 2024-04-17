function registerFonts(fonts) {
    if (typeof document === 'undefined') return;
    fonts.forEach((f) => {
        registerFont(f.fontFamily, f.file);
    });
    return {};
}

function registerFont(fontFamily, ttf) {
    if (ttf.default) ttf = ttf.default;
    const fontStyles = `@font-face { src: url(${ttf}); font-family: '${fontFamily}';}`;
    const id = `${fontFamily}FontFace`;
    if (!document.getElementById(id)) {
        const fStyle = document.createElement('style');
        fStyle.type = 'text/css';
        fStyle.id = id;
        if (fStyle.styleSheet) {
            fStyle.styleSheet.cssText = fontStyles;
        } else {
            fStyle.appendChild(document.createTextNode(fontStyles));
        }
        document.head.appendChild(fStyle);
    }
}

const fonts = registerFonts(require('./fonts.web.js').default);

export default fonts;
