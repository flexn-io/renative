import { Text } from 'react-native';
import { testProps } from '../../config';

export const CastComponent = () => {
    return (
        <Text style={{ color: 'black' }} {...testProps('app-harness-home-cast-support')}>
            Not supported
        </Text>
    );
};
