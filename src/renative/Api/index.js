import { getNavigation } from '../Navigation';

export default {
    platform: 'unknown',
    formFactor: 'unknown',
    platformGroup: 'unknown',
    navigation: {
        openDrawer: () => {
            const nav = getNavigation();
            nav.openDrawer();
        },
        navigate: (route) => {
            const nav = getNavigation();
            nav.navigate(route);
        },
    },
};
