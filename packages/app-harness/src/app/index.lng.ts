import { Router, Utils } from '@lightningjs/sdk';
import HomeScreen from '../components/HomeScreen/home.lng';
export default class App extends Router.App {
    static getFonts() {
        return [{ family: 'Inter-Light', url: Utils.asset('fonts/Inter-Light.ttf') }];
    }

    _setup() {
        Router.startRouter({
            root: 'home',
            routes: [
                {
                    path: 'home',
                    component: HomeScreen,
                },
            ],
        });
    }
}
