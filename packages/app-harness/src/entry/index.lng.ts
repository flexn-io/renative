import { Launch } from '@lightningjs/sdk';
import App from '../app';

const app: any = App; //Temp lng.ts type workaround

const Main = (appSettings, platformSettings, appData) => Launch(app, appSettings, platformSettings, appData);

export default Main;
