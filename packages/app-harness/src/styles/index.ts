import { isPlatformIos, isFactorMobile, isFactorWatch } from '@rnv/renative';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        color: 'black',
    },
    logo: {
        width: 30,
        height: 30,
    },
    header: {
        marginTop: isPlatformIos ? 50 : 0, // TODO: remove once safe area view is implemented
        flexDirection: 'row',
        height: 60,
        backgroundColor: 'white',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignItems: 'center',
        padding: 10,
    },
    introText: {
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal: 10,
        display: isFactorMobile || isFactorWatch ? 'none' : 'flex',
    },
    dynamicText: {
        color: 'black',
        fontSize: isFactorWatch ? 10 : 14,
    },
});

export default styles;
