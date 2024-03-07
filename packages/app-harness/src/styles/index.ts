import { isPlatformIos } from '@rnv/renative';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
});

export default styles;
