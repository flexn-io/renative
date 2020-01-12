import { DrawerActions } from 'react-navigation';
import { getNavigation } from '../Navigation';
import platform from './platform';
import factor from './factor';
import { isTizenmobile, isTizenwatch, isTvos, isTizen } from '../is'

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

export const getScaledValue = (v) => {
  if(isTizenmobile()) return v * 3
  if(isTizenwatch()) return v * 2
  if(isTvos()) return v * 2
  if(isTizen()) return v * 2
  return v
}
