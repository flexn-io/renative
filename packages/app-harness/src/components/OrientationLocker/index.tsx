import { View } from 'react-native';

const OrientationLocker = (_props: {
    orientation?: string;
    onChange?: (orientation) => void;
    onDeviceChange?: (orientation) => void;
}) => {
    return <View></View>;
};

const PORTRAIT = 'PORTRAIT';
const LANDSCAPE = 'LANDSCAPE';

export { OrientationLocker, PORTRAIT, LANDSCAPE };
