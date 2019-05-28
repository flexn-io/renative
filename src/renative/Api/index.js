import { DrawerActions } from 'react-navigation';
import { getNavigation } from '../Navigation';

export default {
    platform: 'unknown',
    formFactor: 'unknown',
    platformGroup: 'unknown',
    navigation: {
        openDrawer: () => {
            const nav = getNavigation();
            console.log('FKFJL');
            // nav.openDrawer();
            nav.dispatch(DrawerActions.openDrawer());
        },
        navigate: (route) => {
            const nav = getNavigation();
            nav.navigate(route);
        },
        pop: () => {
            const nav = getNavigation();
            nav.pop();
        }
    },
};
