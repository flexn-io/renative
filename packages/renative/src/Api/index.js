import { DrawerActions } from 'react-navigation';
import { getNavigation } from '../Navigation';
import platform from './platform';
import factor from './factor';

export default {
    platform,
    formFactor: factor,
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
