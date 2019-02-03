
import { isPlatformSupported } from './common';


const run = (platform, program, process) => {
    if (!isPlatformSupported(platform)) return;
    console.log('ADD_PLATFORM: ', cmdOption);
};

export { addPlatform };
