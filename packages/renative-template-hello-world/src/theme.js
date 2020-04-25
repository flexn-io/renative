import { getScaledValue, isEngineWeb, isFactorMobile, isFactorDesktop,
    isFactorTv, isEngineNative, isFactorBrowser, registerServiceWorker, StyleSheet } from 'renative';
// import '../platformAssets/runtime/fontManager';

if (isFactorBrowser) registerServiceWorker();

export const hasMobileWebUI = isFactorMobile && isEngineWeb;
export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop && !hasMobileWebUI;
export const hasFullScreenMenu = hasMobileWebUI;
export const hasVerticalMenu = !hasHorizontalMenu && !hasFullScreenMenu;
export const hasWebFocusableUI = isEngineWeb && isFactorTv;

// Disable yellow warnings UI
console.disableYellowBox = true;

const theme = {
    color1: '#222222',
    color2: '#62DBFB',
    color3: '#FB8D62',
    color4: '#FFFFFF',
    color5: '#AAAAAA',
    primaryFontFamily: 'TimeBurner',
    iconSize: getScaledValue(40),
    menuWidth: hasHorizontalMenu || hasFullScreenMenu ? '100%' : 280,
    menuHeight: hasHorizontalMenu ? getScaledValue(80) : '100%',
    statusBar: 'light-content'
};

export const themeStyles = StyleSheet.create({
    app: {
        flexDirection: isFactorDesktop ? 'row' : 'column', position: 'absolute', top: 0, right: 0, left: 0, bottom: 0
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: getScaledValue(50),
        minHeight: getScaledValue(300),
        alignSelf: 'stretch',
        width: '100%'
    },
    modalContainer: isEngineWeb ? {
        position: 'absolute',
        backgroundColor: theme.color1,
        zIndex: 100,
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%'
    } : {
        flex: 1,
        backgroundColor: theme.color1
    },
    textH2: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    textH3: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(15),
        marginHorizontal: getScaledValue(20),
        marginTop: getScaledValue(5),
        color: theme.color2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    text: {
        fontFamily: theme.primaryFontFamily,
        color: theme.color4,
        fontSize: getScaledValue(20),
        marginTop: getScaledValue(10),
        textAlign: 'left',
    },
    icon: {
        width: getScaledValue(40),
        height: getScaledValue(40),
        margin: getScaledValue(10),
    },
    button: {
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: theme.color2,
        height: getScaledValue(50),
        minWidth: getScaledValue(150),
        maxWidth: getScaledValue(200),
        marginTop: getScaledValue(20)

    },
    buttonText: {
        fontFamily: theme.primaryFontFamily,
        color: theme.color2,
        fontSize: getScaledValue(20),
    },
    screen: {
        position: 'absolute',
        backgroundColor: theme.color1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    screenModal: {
        position: 'absolute',
        backgroundColor: theme.color1,
        top: hasHorizontalMenu && isEngineWeb ? -theme.menuHeight : 0,
        left: hasHorizontalMenu || hasFullScreenMenu || isEngineNative ? 0 : -theme.menuWidth,
        right: 0,
        bottom: 0
    }
});

export default theme;
