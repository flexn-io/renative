function registerFonts(fonts) {
    fonts.forEach(function (f) {
        registerFont(f.fontFamily, f.file);
    });
    return {};
}

function registerFont(fontFamily, ttf) {
    var fontStyles = '@font-face { src: url(' + ttf + '); font-family: ' + fontFamily + ';}';
    var id = fontFamily + 'FontFace';
    if (!document.getElementById(id)) {
        var fStyle = document.createElement('style');
        fStyle.type = 'text/css';
        fStyle.id = id;
        if (fStyle.styleSheet) {
            fStyle.styleSheet.cssText = fontStyles;
        } else {
            fStyle.appendChild(document.createTextNode(fontStyles));
        }
        document.head.appendChild(fStyle);
    }
};

var fonts = registerFonts(require('./fonts.js').default);

export default fonts;
