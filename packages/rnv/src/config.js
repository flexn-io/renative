import { writeObjectSync } from './systemTools/fileutils';
import { npmInstall } from './systemTools/exec';

class Config {
    constructor() {
        this.config = {};
    }

    // async initializeConfig(cmd, subCmd, program) {
    //     this.config = await initializeBuilder(cmd, subCmd, process, program);
    // }

    initializeConfig(c) {
        this.config = c;
        return c;
    }

    getConfig() {
        return this.config;
    }

    get command() {
        return this.config.command;
    }

    get subCommand() {
        return this.config.subCommand;
    }

    get rnvArguments() {
        // commander is stupid https://github.com/tj/commander.js/issues/53
        const { args, rawArgs } = this.config.program;
        const cleanedArgs = args.filter(arg => typeof arg === 'string');
        const missingArg = rawArgs[rawArgs.indexOf(cleanedArgs[1]) + 1];
        cleanedArgs.splice(2, 0, missingArg);
        return cleanedArgs;
    }

    _injectProjectDep(dependency, version, dev = false) {
        const currentPackage = this.config.files.project.package;
        const existingPath = this.config.paths.project.package;
        currentPackage[dev ? 'devDependencies' : 'dependencies'][dependency] = version;
        writeObjectSync(existingPath, currentPackage);
    }

    async injectProjectDependency(dependency, version) {
        this._injectProjectDep(dependency, version);
        await npmInstall();
    }

    async injectProjectDevDependency(dependency, version) {
        this._injectProjectDep(dependency, version, true);
        await npmInstall();
    }

    getProjectConfig() {
        return this.config.files.project;
    }

    //     getBuildConfig() {
    //         return this.config.buildConfig;
    //     }

    //     updateLocalConfig() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     updateGlobalonfig() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     updateCLIPath() {
    //         writeFileSync(file, newConfig);
    //         this.initializeConfig();
    //     }

    //     getPath(path) { // getPath(RNV_PLUGINTEMPLATES_DIR) / PROJECT_BUILDS_DIR...
    //         return this.config.paths[path];
    //     }

    //     get getInfo() {
    //         return this.c.program.info;
    //     }

    //     get platform() {
    //         return this.config.program.platform;
    //     }

    //     get mono() {
    //         return this.config.program.mono;
    //     }

    //     get target() {}

//     set target(newTarget) {
//         this.config.target = newTarget;
//         this.initializeConfig();
//     }
}

export default new Config();
