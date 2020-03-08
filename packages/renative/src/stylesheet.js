import RN from 'react-native';
import engine from './Api/engine';

export const StyleSheet = {
    create: (styles) => {
        if (engine === 'next') return styles;
        return RN.StyleSheet.create(styles);
    }
};
