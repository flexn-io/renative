import { DrawerActions } from 'react-navigation';
import { getNavigation } from '../Navigation';

export default {
    platform: 'unknown',
    formFactor: 'unknown',
    platformGroup: 'unknown',
    navigation: {
        openDrawer: () => {
            const nav = getNavigation();
            nav.dispatch(DrawerActions.openDrawer());
        },
        navigate: (route, params = undefined) => {
            const nav = getNavigation();
            nav.navigate(route, params);
        },
        pop: () => {
            const nav = getNavigation();
            nav.pop();
        }
    },
};
