import { writeObjectSync } from './systemTools/fileutils';
import { npmInstall } from './systemTools/exec';
import { inquirerPrompt } from './systemTools/prompt';

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

    async injectProjectDependency(dependency, version, type, skipInstall = false) {
        const currentPackage = this.config.files.project.package;
        const existingPath = this.config.paths.project.package;
        currentPackage[type][dependency] = version;
        writeObjectSync(existingPath, currentPackage);
        if (!skipInstall) await npmInstall();
        return true;
    }

    getProjectConfig() {
        return this.config.files.project;
    }

    async checkRequiredPackage(pkg, version = false, type, skipAsking = false, skipInstall = false) {
        if (!pkg) return false;
        const projectConfig = this.getProjectConfig();

        if (!projectConfig.package[type][pkg]) {
            let confirm = skipAsking;
            if (!confirm) {
                const resp = await inquirerPrompt({
                    type: 'confirm',
                    message: `You do not have ${pkg} installed. Do you want to add it now?`
                });
                confirm = resp.confirm;
            }

            if (confirm) {
                return this.injectProjectDependency(pkg, version || 'latest', type, skipInstall);
            }
        }
        return false;
    }

    async injectPlatformDependencies(platform) {
        const npmDeps = this.config.files?.rnv?.platformTemplates?.config?.platforms?.[platform]?.npm;

        if (npmDeps) {
            const promises = Object.keys(npmDeps).reduce((acc, type) => { // iterate over dependencies, devDepencencies or optionalDependencies
                Object.keys(npmDeps[type]).forEach((dep) => { // iterate over deps
                    acc.push(this.checkRequiredPackage(dep, npmDeps[type][dep], type, true, true));
                });
                return acc;
            }, []);

            const installed = await Promise.all(promises);

            if (installed.some(i => i === true)) { // do npm i only if something new is added
                await npmInstall();
            }
        }

        // add other deps that are not npm
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
