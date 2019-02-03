
import { isPlatformSupported } from './common';


const runApp = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform)) return;
    console.log('RUN: ', platform);
    resolve();
});

export { runApp };
