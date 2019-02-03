
import { isPlatformSupported } from './common';


const runApp = (platform, program, process) => {
    if (!isPlatformSupported(platform)) return;
    console.log('RUN: ', platform);
};

export { runApp };
