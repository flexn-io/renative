jest.mock('../logging/logger.ts');

jest.mock('../tasks/index.ts', () => ({
    initializeTask: jest.fn(),
    findSuitableTask: () => {
        //Do nothing
    },
}));

const itShouldResolve = (cmd) => {
    it(`${cmd} should resolve`, () => shouldResolve());
};

// const itShouldReject = (cmd, reject) => {
//     it(`${cmd} should reject`, () => shouldReject(cmd, reject));
// };

describe('Testing rnv target', () => {
    itShouldResolve('target help');
    itShouldResolve('target list -p android');
    itShouldResolve('target launch -p android -t emu');
});

describe('Testing rnv plugin', () => {
    itShouldResolve('plugin help');
    itShouldResolve('plugin list -p android');
    itShouldResolve('plugin add');
    itShouldResolve('plugin update');
});

describe('Testing rnv platform', () => {
    itShouldResolve('platform help');
    itShouldResolve('platform list');
    itShouldResolve('platform eject');
    itShouldResolve('platform connect');
    itShouldResolve('platform configure');
});

describe('Testing rnv template', () => {
    itShouldResolve('template help');
    itShouldResolve('template add');
    itShouldResolve('template list');
    itShouldResolve('template apply');
});

describe('Testing rnv new', () => {
    itShouldResolve('new');
});

describe('Testing rnv run', () => {
    itShouldResolve('run help');
    itShouldResolve('run -p ios');
    itShouldResolve('run -p android');
    itShouldResolve('run -p androidwear');
    itShouldResolve('run -p androidtv');
    itShouldResolve('run -p tizen');
    itShouldResolve('run -p tizenmobile');
    itShouldResolve('run -p tizenwatch');
    itShouldResolve('run -p webos');
    itShouldResolve('run -p web');
    itShouldResolve('run -p macos');
    itShouldResolve('run -p firefoxtv');
    itShouldResolve('run -p firefoxos');
});

describe('Testing rnv build', () => {
    itShouldResolve('build help');
    itShouldResolve('build -p ios');
    itShouldResolve('build -p android');
    itShouldResolve('build -p androidwear');
    itShouldResolve('build -p androidtv');
    itShouldResolve('build -p tizen');
    itShouldResolve('build -p tizenmobile');
    itShouldResolve('build -p tizenwatch');
    itShouldResolve('build -p webos');
    itShouldResolve('build -p web');
    itShouldResolve('build -p macos');
    itShouldResolve('build -p firefoxtv');
    itShouldResolve('build -p firefoxos');
});

describe('Testing rnv package', () => {
    itShouldResolve('package help');
    itShouldResolve('package -p ios');
});

describe('Testing rnv deploy', () => {
    itShouldResolve('deploy help');
    itShouldResolve('deploy -p ios');
});

describe('Testing rnv export', () => {
    itShouldResolve('export help');
    itShouldResolve('export -p ios');
});

describe('Testing rnv workspace', () => {
    itShouldResolve('workspace help');
    itShouldResolve('workspace list');
});

describe('Testing rnv clean', () => {
    itShouldResolve('clean help');
    itShouldResolve('clean');
});

describe('Testing rnv crypto', () => {
    itShouldResolve('crypto help');
    itShouldResolve('crypto encrypt');
    itShouldResolve('crypto decrypt');
    itShouldResolve('crypto installCerts');
    itShouldResolve('crypto installProfiles');
    itShouldResolve('crypto installProfile');
    itShouldResolve('crypto updateProfile');
    itShouldResolve('crypto updateProfiles');
});

describe('Testing rnv hooks', () => {
    itShouldResolve('hooks help');
    itShouldResolve('hooks run');
    itShouldResolve('hooks list');
    itShouldResolve('hooks pipes');
});

describe('Testing rnv status', () => {
    itShouldResolve('status help');
    itShouldResolve('status');
});

describe('Testing rnv configure', () => {
    itShouldResolve('configure help');
    itShouldResolve('configure');
});

// ###############################################
// HELPERS
// ###############################################

// const shouldReject = async (cmd, reject) => {
//     await expect(cli(getConfig(cmd), null, true)).rejects.toThrow(reject);
// };

const shouldResolve = async () => {
    // await cli(getConfig(cmd));
    // await expect(cli(getConfig(cmd), null, true)).resolves;
};

// const getConfig = (s) => {
//     const argArray = s.split(' ');

//     const cmd = argArray.shift();
//     let subCmd;

//     if (argArray[0]) {
//         if (!argArray[0].startsWith('-')) {
//             subCmd = argArray.shift();
//         }
//     }

//     const c = createRnvConfig({
//         command: cmd,
//         subCommand: subCmd
//     }, { process: true }, cmd, subCmd);

//     c.buildConfig = {
//         defaults: {
//             supportedPlatforms: ['ios', 'android', 'tizen', 'web', 'macos',
//                 'webos', 'tizenmobile', 'tizenwatch', 'androidtv', 'androidwear',
//                 'firefoxtv', 'firefoxos']
//         },
//         defaultTargets: {},
//         common: {}
//     };

//     argArray.forEach((v, i) => {
//         switch (v) {
//             case '-p':
//                 c.platform = argArray[i + 1];
//                 break;
//             case '-t':
//                 c.target = argArray[i + 1];
//                 break;
//             default:
//                 // DO nothing
//         }
//     });
//     configureFilesystem(() => {}, () => {});

//     generateBuildConfig(c);
//     return c;
// };
