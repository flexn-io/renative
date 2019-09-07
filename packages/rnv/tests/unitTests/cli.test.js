import { createRnvConfig, generateBuildConfig } from '../../src/configTools/configParser';
import cli from '../../src/cli';

const itShouldResolve = (cmd) => {
    it(`${cmd} should resolve`, () => shouldResolve(cmd));
};

const itShouldReject = (cmd, reject) => {
    it(`${cmd} should reject`, () => shouldReject(cmd, reject));
};

describe('Testing rnv target', () => {
    itShouldReject('target list -p android', 'Platform unsupported for automated SDK setup');
    itShouldResolve('target launch -p android -t emu');
});

describe('Testing rnv plugin', () => {
    itShouldResolve('plugin list -p android');
    itShouldResolve('plugin add');
    itShouldResolve('plugin update');
});

describe('Testing rnv platform', () => {
    itShouldResolve('platform list');
    itShouldResolve('platform eject');
    itShouldResolve('platform connect');
    itShouldResolve('platform configure');
});

describe('Testing rnv new', () => {
    itShouldResolve('new');
});

describe('Testing rnv run', () => {
    itShouldResolve('run -p ios');
});


// ###############################################
// HELPERS
// ###############################################

const shouldReject = async (cmd, reject) => {
    await expect(cli(getConfig(cmd))).rejects.toThrow(reject);
};


const shouldResolve = async (cmd) => {
    await expect(cli(getConfig(cmd))).resolves;
};

const getConfig = (s) => {
    const argArray = s.split(' ');

    const cmd = argArray.shift();
    let subCmd;

    if (argArray[0]) {
        if (!argArray[0].startsWith('-')) {
            subCmd = argArray.shift();
        }
    }

    const c = createRnvConfig({
        command: cmd,
        subCommand: subCmd
    }, { process: true }, cmd, subCmd);

    c.buildConfig = {
        defaults: {
            supportedPlatforms: ['ios', 'android']
        },
        defaultTargets: {},
        common: {}
    };

    argArray.forEach((v, i) => {
        switch (v) {
        case '-p':
            c.platform = argArray[i + 1];
            break;
        case '-t':
            c.target = argArray[i + 1];
            break;
        }
    });

    generateBuildConfig(c);
    return c;
};
