import { StyleSheet as StyleSheet2 } from 'react-native';
import engine from './Api/engine';

export const StyleSheet = {
    create: (styles) => {
        if (engine === 'engine-rn-next') return styles;
        return StyleSheet2.create(styles);
    }
};
