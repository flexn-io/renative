import { initializeBuilder } from './common';

class Config {
    constructor() {
        this.config = {};
    }

    async initializeConfig(cmd, subCmd, program) {
        this.config = await initializeBuilder(cmd, subCmd, process, program);
    }

    getBuildConfig() {
        return this.config.buildConfig;
    }

    updateLocalConfig() {
        writeFileSync(file, newConfig);
        this.initializeConfig();
    }

    updateGlobalonfig() {
        writeFileSync(file, newConfig);
        this.initializeConfig();
    }

    updateCLIPath() {
        writeFileSync(file, newConfig);
        this.initializeConfig();
    }

    getPath(path) { // getPath(RNV_PLUGINTEMPLATES_DIR) / PROJECT_BUILDS_DIR...
        return this.config.paths[path];
    }

    get getInfo() {
        return this.c.program.info;
    }

    get platform() {
        return this.config.program.platform;
    }

    get mono() {
        return this.config.program.mono;
    }

    get target() {}

    set target(newTarget) {
        this.config.target = newTarget;
        this.initializeConfig();
    }
}

export default new Config();
