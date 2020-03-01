import { getScaledValue, isEngineWeb } from 'renative';
import { StyleSheet } from 'react-native';

const theme = {
    color1: '#222222',
    color2: '#62DBFB',
    color3: '#FB8D62',
    color4: '#FFFFFF',
    color5: '#AAAAAA',
    primaryFontFamily: 'TimeBurner',
    iconSize: getScaledValue(40)
};

export const themeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color1,
        justifyContent: 'center',
        alignItems: 'center',
        height: isEngineWeb ? '100vh' : '100%',
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
    }
});

export default theme;
