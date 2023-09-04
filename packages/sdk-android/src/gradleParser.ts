import path from 'path';
import {
    Common,
    FileUtils,
    Logger,
    OverridesOptions,
    PluginManager,
    RenativeConfigPlatform,
    RenativeConfigPluginPlatform,
    Resolver,
    RnvContext,
    RnvPlugin,
    Utils,
} from 'rnv';
import { Payload } from './types';

const { getAppFolder, getAppVersion, getAppVersionCode, getAppId, getBuildFilePath, getConfigProp, addSystemInjects } =
    Common;
const { fsExistsSync, writeCleanFile, fsWriteFileSync } = FileUtils;
const { doResolve, doResolvePath } = Resolver;
const { chalk, logTask, logWarning, logDebug } = Logger;
const { sanitizePluginPath, includesPluginPath } = PluginManager;
const { isSystemWin } = Utils;

export const parseBuildGradleSync = (c: RnvContext<Payload>) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;

    let dexOptions = '';

    if (c.payload.pluginConfigAndroid.buildGradleBuildScriptDexOptions) {
        dexOptions = `dexOptions() {
            ${c.payload.pluginConfigAndroid.buildGradleBuildScriptDexOptions}
        }`;
    }
    const injects: OverridesOptions = [
        {
            pattern: '{{COMPILE_SDK_VERSION}}',
            override: c.payload.pluginConfigAndroid.compileSdkVersion,
        },
        {
            pattern: '{{INJECT_BUILD_TOOLS_VERSION}}',
            override: c.payload.pluginConfigAndroid.gradleBuildToolsVersion,
        },
        {
            pattern: '{{SUPPORT_LIB_VERSION}}',
            override: c.payload.pluginConfigAndroid.supportLibVersion,
        },
        {
            pattern: '{{BUILD_TOOLS_VERSION}}',
            override: c.payload.pluginConfigAndroid.buildToolsVersion,
        },
        {
            pattern: '{{PLUGIN_INJECT_ALLPROJECTS_REPOSITORIES}}',
            override: c.payload.pluginConfigAndroid.buildGradleAllProjectsRepositories,
        },
        {
            pattern: '{{PLUGIN_INJECT_BUILDSCRIPT_REPOSITORIES}}',
            override: c.payload.pluginConfigAndroid.buildGradleBuildScriptRepositories,
        },
        {
            pattern: '{{INJECT_KOTLIN_VERSION}}',
            override: c.payload.pluginConfigAndroid.kotlinVersion,
        },
        {
            pattern: '{{INJECT_GOOGLE_SERVICES_VERSION}}',
            override: c.payload.pluginConfigAndroid.googleServicesVersion,
        },
        {
            pattern: '{{INJECT_PLUGINS}}',
            override: c.payload.pluginConfigAndroid.buildGradlePlugins,
        },
        {
            pattern: '{{MIN_SDK_VERSION}}',
            override: c.payload.pluginConfigAndroid.minSdkVersion,
        },
        {
            pattern: '{{INJECT_AFTER_ALL}}',
            override: c.payload.pluginConfigAndroid.buildGradleAfterAll,
        },
        {
            pattern: '{{PLUGIN_INJECT_BUILDSCRIPT_DEPENDENCIES}}',
            override: c.payload.pluginConfigAndroid.buildGradleBuildScriptDependencies,
        },
        {
            pattern: '{{PLUGIN_INJECT_DEXOPTIONS}}',
            override: dexOptions,
        },
        {
            pattern: '{{INJECT_REACT_NATIVE_ENGINE}}',
            override: c.payload.pluginConfigAndroid.injectReactNativeEngine,
        },
        {
            pattern: '{{PATH_REACT_NATIVE}}',
            override:
                doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native', true, {
                    forceForwardPaths: true,
                }) || '',
        },
    ];
    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, 'build.gradle'),
        path.join(appFolder, 'build.gradle'),
        injects,
        undefined,
        c
    );
};

const setReactNativeEngineDefault = (c: RnvContext<Payload>) => {
    c.payload.pluginConfigAndroid.injectReactNativeEngine = `
maven { url "${doResolve('react-native', true, { forceForwardPaths: true })}/android" }
maven { url("${doResolve('jsc-android', true, { forceForwardPaths: true })}/dist") }
`;

    c.payload.pluginConfigAndroid.appBuildGradleImplementations += "    implementation 'org.webkit:android-jsc:+'\n";

    c.payload.pluginConfigAndroid.injectHermes = '    enableHermes: false,';
};

const setReactNativeEngineHermes = (c: RnvContext<Payload>) => {
    c.payload.pluginConfigAndroid.injectReactNativeEngine = `
  maven { url "${doResolve('react-native', true, { forceForwardPaths: true })}/android" }
  maven { url("${doResolve('jsc-android', true, { forceForwardPaths: true })}/dist") }
  `;

    c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    debugImplementation files("${doResolve(
        'hermes-engine',
        true,
        { forceForwardPaths: true }
    )}/android/hermes-debug.aar")\n`;
    c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    releaseImplementation files("${doResolve(
        'hermes-engine',
        true,
        { forceForwardPaths: true }
    )}/android/hermes-release.aar")\n`;

    c.payload.pluginConfigAndroid.injectHermes = `    enableHermes: true,
hermesCommand: "{{PATH_HERMES_ENGINE}}/%OS-BIN%/hermes",
deleteDebugFilesForVariant: { false },
    `;
};

const setReactNativeEngineV8 = (c: RnvContext<Payload>) => {
    c.payload.pluginConfigAndroid.injectReactNativeEngine = `
  maven { url "${doResolve('react-native', true, { forceForwardPaths: true })}/android" }
  maven { url("${doResolve('jsc-android', true, { forceForwardPaths: true })}/dist") }
  `;

    c.payload.pluginConfigAndroid.pluginApplicationImports += `import com.facebook.react.bridge.JavaScriptExecutorFactory
    import com.facebook.react.modules.systeminfo.AndroidInfoHelpers
    import io.csie.kudo.reactnative.v8.executor.V8ExecutorFactory`;

    c.payload.pluginConfigAndroid.reactNativeHostMethods += `override fun getJavaScriptExecutorFactory(): JavaScriptExecutorFactory {
            return V8ExecutorFactory(
                applicationContext,
                packageName,
                AndroidInfoHelpers.getFriendlyDeviceName(),
                getUseDeveloperSupport()
            )
        }`;

    c.payload.pluginConfigAndroid.injectHermes = '    enableHermes: false,';

    c.payload.pluginConfigAndroid.packagingOptions += `
    exclude '**/libjsc.so'`;
};

export const parseAppBuildGradleSync = (c: RnvContext<Payload>) => {
    logTask('parseAppBuildGradleSync');
    const appFolder = getAppFolder(c);
    const { platform } = c;

    // ANDROID PROPS
    c.payload.pluginConfigAndroid.minSdkVersion = getConfigProp(c, platform, 'minSdkVersion', 24);
    c.payload.pluginConfigAndroid.targetSdkVersion = getConfigProp(c, platform, 'targetSdkVersion', 28);
    c.payload.pluginConfigAndroid.compileSdkVersion = getConfigProp(c, platform, 'compileSdkVersion', 28);
    c.payload.pluginConfigAndroid.gradleBuildToolsVersion = getConfigProp(
        c,
        platform,
        'gradleBuildToolsVersion',
        '4.2.2'
    );
    c.payload.pluginConfigAndroid.supportLibVersion = getConfigProp(c, platform, 'supportLibVersion', '28.0.0');
    c.payload.pluginConfigAndroid.buildToolsVersion = getConfigProp(c, platform, 'buildToolsVersion', '28.0.0');
    c.payload.pluginConfigAndroid.kotlinVersion = getConfigProp(c, platform, 'kotlinVersion', '1.4.20');
    c.payload.pluginConfigAndroid.googleServicesVersion = getConfigProp(c, platform, 'googleServicesVersion', '4.2.0');

    // REACT NATIVE ENGINE
    const enableHermes = getConfigProp(c, platform, 'enableHermes');
    if (enableHermes === true) {
        logWarning('enableHermes is DEPRECATED. use "reactNativeEngine": "hermes" instead.');
    }

    const reactNativeEngine = getConfigProp(c, c.platform, 'reactNativeEngine', 'default');

    switch (reactNativeEngine) {
        case 'default': {
            setReactNativeEngineDefault(c);
            break;
        }
        case 'v8-android': {
            setReactNativeEngineV8(c);
            break;
        }
        case 'v8-android-nointl': {
            setReactNativeEngineV8(c);
            break;
        }
        case 'v8-android-jit': {
            setReactNativeEngineV8(c);
            break;
        }
        case 'v8-android-jit-nointl': {
            setReactNativeEngineV8(c);
            break;
        }
        case 'hermes': {
            setReactNativeEngineHermes(c);
            break;
        }
        default: {
            logWarning(`Unsupported react native engine ${reactNativeEngine}. Will use default instead`);
            setReactNativeEngineDefault(c);
        }
    }

    // SIGNING CONFIGS
    const debugSigning = `
    debug {
        storeFile file('debug.keystore')
        storePassword "android"
        keyAlias "androiddebugkey"
        keyPassword "android"
    }`;

    c.payload.pluginConfigAndroid.appBuildGradleSigningConfigs = `${debugSigning}
    release`;
    c.payload.pluginConfigAndroid.localProperties = '';

    const obj = c.files.workspace?.appConfig?.configPrivate?.[platform];
    if (obj) {
        logWarning(`DEPRECATED structure in ${chalk().white(c.paths.workspace.appConfig.configPrivate)}.
Your ${chalk().red(platform)} object needs to be located under ${chalk().green('platforms')} object.`);
    }

    const storeFile = getConfigProp(c, c.platform, 'storeFile') || obj?.storeFile;
    const keyAlias = getConfigProp(c, c.platform, 'keyAlias') || obj?.keyAlias;
    const storePassword = getConfigProp(c, c.platform, 'storePassword') || obj?.storePassword;
    const keyPassword = getConfigProp(c, c.platform, 'keyPassword') || obj?.keyPassword;
    const minifyEnabled = getConfigProp(c, c.platform, 'minifyEnabled', false);

    c.payload.pluginConfigAndroid.store = {
        storeFile,
        keyAlias,
        storePassword,
        keyPassword,
    };

    if (!!storeFile && !!keyAlias && !!storePassword && !!keyPassword) {
        const keystorePath = storeFile;
        let keystorePathFull = keystorePath;
        if (keystorePath) {
            if (keystorePath.startsWith('.')) {
                keystorePathFull = path.join(c.paths.workspace.appConfig.dir, keystorePath);
            } else if (!fsExistsSync(keystorePath)) {
                keystorePathFull = path.join(c.paths.workspace.appConfig.dir, keystorePath);
            }
            if (isSystemWin) {
                keystorePathFull = keystorePathFull.replace(/\\/g, '/');
            }
        }
        if (fsExistsSync(keystorePathFull)) {
            const genPropsPath = path.join(appFolder, 'keystore.properties');
            fsWriteFileSync(
                genPropsPath,
                `# auto generated by ReNative
                storeFile=${keystorePathFull}
                keyAlias=${keyAlias}
                storePassword=${storePassword}
                keyPassword=${keyPassword}`
            );

            c.payload.pluginConfigAndroid.appBuildGradleSigningConfigs = `${debugSigning}
          release {
              storeFile file(keystoreProps['storeFile'])
              storePassword keystoreProps['storePassword']
              keyAlias keystoreProps['keyAlias']
              keyPassword keystoreProps['keyPassword']
          }`;

            c.payload.pluginConfigAndroid.localProperties = `
        def keystorePropsFile = rootProject.file("keystore.properties")
        def keystoreProps = new Properties()
        keystoreProps.load(new FileInputStream(keystorePropsFile))`;
        } else {
            logWarning(
                `Your ${chalk().white(
                    keystorePathFull
                )} does not exist. You won't be able to make production releases without it!`
            );
        }
    } else if (storeFile) {
        const missingKeys = [];
        if (!keyAlias) missingKeys.push('keyAlias');
        if (!storePassword) missingKeys.push('storePassword');
        if (!keyPassword) missingKeys.push('keyPassword');
        logWarning(`You defined store file ${chalk().white(
            storeFile
        )}, but you are missing following keys: ${chalk().red(missingKeys.join(', '))}
Check your private files at:
${chalk().white(c.paths.workspace?.appConfig?.configsPrivate?.join('\n'))}`);
    }

    // BUILD_TYPES
    const pluginConfig = c.buildConfig ?? {};
    const debugBuildTypes = pluginConfig?.platforms?.[platform]?.gradle?.buildTypes?.debug ?? [];
    const releaseBuildTypes: string[] = pluginConfig?.platforms?.[platform]?.gradle?.buildTypes?.release ?? [];
    const isSigningDisabled = getConfigProp(c, platform, 'disableSigning') === true;
    c.payload.pluginConfigAndroid.buildTypes = `
    debug {
        minifyEnabled ${minifyEnabled}
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        ${debugBuildTypes.join('\n        ')}
    }
    release {
        minifyEnabled ${minifyEnabled}
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        ${isSigningDisabled ? '' : 'signingConfig signingConfigs.release'}
        ${releaseBuildTypes.join('\n        ')}
    }`;

    // MULTI APK
    const versionCodeOffset = getConfigProp(c, platform, 'versionCodeOffset', 0);
    const isMultiApk = getConfigProp(c, platform, 'multipleAPKs', false) === true;
    c.payload.pluginConfigAndroid.multiAPKs = '';
    if (isMultiApk) {
        const multiSet = 'Integer.parseInt(Integer.toString(variant.versionCode) + Integer.toString(bavc))';
        c.payload.pluginConfigAndroid.multiAPKs = `
      ext.abiCodes = ["armeabi-v7a": 1, "x86": 2, "arm64-v8a": 3, "x86_64": 4]
      import com.android.build.OutputFile

      android.applicationVariants.all { variant ->
        variant.outputs.each { output ->
          def bavc = project.ext.abiCodes.get(output.getFilter(OutputFile.ABI))
          if (bavc != null) {
            output.versionCodeOverride = ${multiSet} + ${versionCodeOffset}
          }
        }
      }`;
    }

    // SPLITS
    c.payload.pluginConfigAndroid.splits = '';
    if (isMultiApk) {
        c.payload.pluginConfigAndroid.splits = `
    splits {
      abi {
          reset()
          enable true
          include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
          universalApk false
      }
    }
`;
    }

    // PACKAGING OPTIONS
    c.payload.pluginConfigAndroid.packagingOptions += `
    exclude 'META-INF/DEPENDENCIES.txt'
    exclude 'META-INF/DEPENDENCIES'
    exclude 'META-INF/dependencies.txt'
    exclude 'META-INF/LICENSE.txt'
    exclude 'META-INF/LICENSE'
    exclude 'META-INF/license.txt'
    exclude 'META-INF/LGPL2.1'
    exclude 'META-INF/NOTICE.txt'
    exclude 'META-INF/NOTICE'
    exclude 'META-INF/notice.txt'
    pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    pickFirst 'lib/x86_64/libc++_shared.so'
    pickFirst 'lib/x86/libc++_shared.so'
    pickFirst 'lib/arm64-v8a/libc++_shared.so'
    pickFirst 'lib/arm64-v8a/libjsc.so'
    pickFirst 'lib/x86_64/libjsc.so'`;

    // COMPILE OPTIONS
    c.payload.pluginConfigAndroid.compileOptions = `
    sourceCompatibility 1.8
    targetCompatibility 1.8`;

    // TODO This is temporary ANDROIDX support. whole gradle parser will be refactored in the near future
    let enableAndroidX = getConfigProp(c, platform, 'enableAndroidX', 'androidx.appcompat:appcompat:1.1.0');
    if (enableAndroidX === true) {
        enableAndroidX = 'androidx.appcompat:appcompat:1.1.0';
    }

    if (enableAndroidX !== false) {
        c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    implementation "${enableAndroidX}"\n`;
    } else {
        c.payload.pluginConfigAndroid.appBuildGradleImplementations +=
            "    implementation 'com.android.support:appcompat-v7:27.0.2'\n";
    }

    c.payload.pluginConfigAndroid.appBuildGradleImplementations +=
        '    implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02"\n';

    const injects = [
        {
            pattern: '{{PLUGIN_APPLY}}',
            override: c.payload.pluginConfigAndroid.applyPlugin,
        },
        { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
        {
            pattern: '{{VERSION_CODE}}',
            override: getAppVersionCode(c, platform),
        },
        {
            pattern: '{{VERSION_NAME}}',
            override: getAppVersion(c, platform),
        },
        {
            pattern: '{{PLUGIN_IMPLEMENTATIONS}}',
            override: c.payload.pluginConfigAndroid.appBuildGradleImplementations,
        },
        {
            pattern: '{{PLUGIN_AFTER_EVALUATE}}',
            override: c.payload.pluginConfigAndroid.appBuildGradleAfterEvaluate,
        },
        {
            pattern: '{{PLUGIN_SIGNING_CONFIGS}}',
            override: c.payload.pluginConfigAndroid.appBuildGradleSigningConfigs,
        },
        {
            pattern: '{{PLUGIN_SPLITS}}',
            override: c.payload.pluginConfigAndroid.splits,
        },
        {
            pattern: '{{PLUGIN_ANDROID_DEFAULT_CONFIG}}',
            override: c.payload.pluginConfigAndroid.defaultConfig,
        },
        {
            pattern: '{{PLUGIN_PACKAGING_OPTIONS}}',
            override: c.payload.pluginConfigAndroid.packagingOptions,
        },
        {
            pattern: '{{PLUGIN_BUILD_TYPES}}',
            override: c.payload.pluginConfigAndroid.buildTypes,
        },
        {
            pattern: '{{PLUGIN_MULTI_APKS}}',
            override: c.payload.pluginConfigAndroid.multiAPKs,
        },
        {
            pattern: '{{MIN_SDK_VERSION}}',
            override: c.payload.pluginConfigAndroid.minSdkVersion,
        },
        {
            pattern: '{{TARGET_SDK_VERSION}}',
            override: c.payload.pluginConfigAndroid.targetSdkVersion,
        },
        {
            pattern: '{{COMPILE_SDK_VERSION}}',
            override: c.payload.pluginConfigAndroid.compileSdkVersion,
        },
        {
            pattern: '{{PLUGIN_COMPILE_OPTIONS}}',
            override: c.payload.pluginConfigAndroid.compileOptions,
        },
        {
            pattern: '{{PLUGIN_LOCAL_PROPERTIES}}',
            override: c.payload.pluginConfigAndroid.localProperties,
        },
        {
            pattern: '{{INJECT_HERMES}}',
            override: c.payload.pluginConfigAndroid.injectHermes,
        },
        {
            pattern: '{{PATH_REACT_NATIVE}}',
            override: doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native', true, {
                forceForwardPaths: true,
            }),
        },
        {
            pattern: '{{PATH_HERMES_ENGINE}}',
            override: doResolve('hermes-engine', true, { forceForwardPaths: true }),
        },
        {
            pattern: '{{INJECT_KOTLIN_VERSION}}',
            override: c.payload.pluginConfigAndroid.kotlinVersion,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, 'app/build.gradle'),
        path.join(appFolder, 'app/build.gradle'),
        injects,
        undefined,
        c
    );
};

export const parseSettingsGradleSync = (c: RnvContext<Payload>) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;
    const injects = [
        {
            pattern: '{{PLUGIN_INCLUDES}}',
            override: c.payload.pluginConfigAndroid.pluginIncludes,
        },
        {
            pattern: '{{PLUGIN_PATHS}}',
            override: c.payload.pluginConfigAndroid.pluginPaths,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, 'settings.gradle'),
        path.join(appFolder, 'settings.gradle'),
        injects,
        undefined,
        c
    );
};

export const parseGradlePropertiesSync = (c: RnvContext<Payload>) => {
    const appFolder = getAppFolder(c);
    const { platform } = c;
    // GRADLE.PROPERTIES
    let pluginGradleProperties = '';
    const pluginConfigAndroid: RenativeConfigPlatform = c.buildConfig?.platforms?.[platform] || {};

    const gradleProps = pluginConfigAndroid['gradle.properties'];

    if (gradleProps) {
        const enableAndroidX = getConfigProp(c, platform, 'enableAndroidX', true);
        if (enableAndroidX === true) {
            gradleProps['android.useAndroidX'] = true;
            gradleProps['android.enableJetifier'] = true;
        }

        Object.keys(gradleProps).forEach((key) => {
            pluginGradleProperties += `${key}=${gradleProps[key]}\n`;
        });
    }

    const gradleProperties = 'gradle.properties';

    const injects = [
        {
            pattern: '{{PLUGIN_GRADLE_PROPERTIES}}',
            override: pluginGradleProperties,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, platform, gradleProperties),
        path.join(appFolder, gradleProperties),
        injects,
        undefined,
        c
    );
};

export const injectPluginGradleSync = (
    c: RnvContext<Payload>,
    pluginRoot: RnvPlugin,
    plugin: RenativeConfigPluginPlatform,
    key: string
) => {
    // const keyFixed = key.replace(/\//g, '-').replace(/@/g, '');
    // const packagePath = plugin.path ?? `${key}/android`;
    // let pathAbsolute;
    // try {
    //     pathAbsolute = plugin.path
    //         ? doResolvePath(packagePath, true, { keepSuffix: true })
    //         : doResolvePath(packagePath, true, { keepSuffix: true });
    // } catch (err) {
    //     logWarning(
    //         `GradleParser: plugin ${packagePath} not resolvable and has been skipped`
    //     );
    //     return;
    // }
    // const modulePath = `../../${pathFixed}`;

    // let packageParams = '';
    // if (plugin.packageParams) {
    //     packageParams = plugin.packageParams.join(',');
    // }
    const keyFixed = key.replace(/\//g, '-').replace(/@/g, '');
    const pathFixed = plugin.path ? `${plugin.path}` : `${key}/android`;
    const skipPathResolutions = pluginRoot['no-npm'];
    let pathAbsolute;

    if (!skipPathResolutions) {
        if (includesPluginPath(pathFixed)) {
            pathAbsolute = sanitizePluginPath(pathFixed, key, true, { forceForwardPaths: true });
        } else {
            pathAbsolute = doResolvePath(pathFixed, true, { forceForwardPaths: true });
        }
    }

    // APP/BUILD.GRADLE
    if (plugin.projectName) {
        if (!plugin.skipLinking && !skipPathResolutions) {
            c.payload.pluginConfigAndroid.pluginIncludes += `, ':${plugin.projectName}'`;
            // }').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
            c.payload.pluginConfigAndroid.pluginPaths += `project(':${plugin.projectName}').projectDir = new File('${pathAbsolute}')\n`;
        }
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                c.payload.pluginConfigAndroid.appBuildGradleImplementations += `${plugin.implementation}\n`;
            } else {
                c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    implementation project(':${plugin.projectName}')\n`;
            }
        }
    } else {
        if (!plugin.skipLinking && !skipPathResolutions) {
            c.payload.pluginConfigAndroid.pluginIncludes += `, ':${keyFixed}'`;
            c.payload.pluginConfigAndroid.pluginPaths += `project(':${keyFixed}').projectDir = new File('${pathAbsolute}')\n`;
        }
        if (!plugin.skipLinking && !plugin.skipImplementation) {
            if (plugin.implementation) {
                c.payload.pluginConfigAndroid.appBuildGradleImplementations += `${plugin.implementation}\n`;
            } else {
                c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    implementation project(':${keyFixed}')\n`;
            }
        }
    }

    parseAndroidConfigObject(c, plugin, key);

    if (!skipPathResolutions && pathAbsolute) {
        _fixAndroidLegacy(c, pathAbsolute);
    }
};

const getObj = <T = any>(c: RnvContext, obj: any, keys: Array<string>): T | undefined => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = obj ? obj[key] : getConfigProp(c, c.platform, key);
        if (val) return val;
    }
};

export const parseAndroidConfigObject = (c: RnvContext, obj?: any, key = '') => {
    const implementations = getObj<string[]>(c, obj, ['implementations']);
    if (implementations) {
        implementations.forEach((v) => {
            c.payload.pluginConfigAndroid.appBuildGradleImplementations += `    implementation ${sanitizePluginPath(
                v,
                key
            )}\n`;
        });
    }

    // APP/BUILD.GRADLE
    const appBuildGradle = getObj<RenativeConfigPluginPlatform['app/build.gradle']>(c, obj, ['app/build.gradle']);
    if (appBuildGradle) {
        if (appBuildGradle.apply) {
            appBuildGradle.apply.forEach((v) => {
                c.payload.pluginConfigAndroid.applyPlugin += `apply ${sanitizePluginPath(v, key)}\n`;
            });
        }

        if (appBuildGradle.defaultConfig) {
            appBuildGradle.defaultConfig.forEach((v) => {
                c.payload.pluginConfigAndroid.defaultConfig += `${sanitizePluginPath(v, key)}\n`;
            });
        }
    }

    const afterEvaluate = getObj<RenativeConfigPluginPlatform['afterEvaluate']>(c, obj, ['afterEvaluate']);
    if (afterEvaluate) {
        afterEvaluate.forEach((v) => {
            c.payload.pluginConfigAndroid.appBuildGradleAfterEvaluate += ` ${sanitizePluginPath(v, key)}\n`;
        });
    }

    // BUILD.GRADLE
    const buildGradle = getObj<RenativeConfigPluginPlatform['build.gradle']>(c, obj, ['BuildGradle', 'build.gradle']);

    const allProjRepos = buildGradle?.allprojects?.repositories;
    if (allProjRepos) {
        Object.keys(allProjRepos).forEach((k) => {
            if (allProjRepos[k] === true) {
                c.payload.pluginConfigAndroid.buildGradleAllProjectsRepositories += `${sanitizePluginPath(k, key)}\n`;
            }
        });
    }

    const plugins = buildGradle?.plugins;
    if (plugins?.forEach) {
        plugins.forEach((k) => {
            c.payload.pluginConfigAndroid.buildGradlePlugins += `${k}\n`;
        });
    }
    const buildscriptRepos = buildGradle?.buildscript?.repositories;
    if (buildscriptRepos) {
        Object.keys(buildscriptRepos).forEach((k) => {
            if (buildscriptRepos[k] === true) {
                c.payload.pluginConfigAndroid.buildGradleBuildScriptRepositories += `${k}\n`;
            }
        });
    }

    const buildscriptDeps = buildGradle?.buildscript?.dependencies;
    if (buildscriptDeps) {
        Object.keys(buildscriptDeps).forEach((k) => {
            if (buildscriptDeps[k] === true) {
                c.payload.pluginConfigAndroid.buildGradleBuildScriptDependencies += `${k}\n`;
            }
        });
    }

    const buildscriptDexOptions = buildGradle?.dexOptions;
    if (buildscriptDexOptions) {
        Object.keys(buildscriptDexOptions).forEach((k) => {
            if (buildscriptDexOptions[k] === true) {
                c.payload.pluginConfigAndroid.buildGradleBuildScriptDexOptions += `${k}\n`;
            }
        });
    }

    const injectAfterAll = buildGradle?.injectAfterAll;
    if (injectAfterAll?.forEach) {
        injectAfterAll.forEach((k) => {
            c.payload.pluginConfigAndroid.buildGradleAfterAll += `${sanitizePluginPath(k, key)}\n`;
        });
    }
};

const _fixAndroidLegacy = (c: RnvContext, modulePath: string) => {
    const buildGradle = path.join(c.paths.project.dir, modulePath, 'build.gradle');

    if (fsExistsSync(buildGradle)) {
        logDebug('FIX:', buildGradle);
        writeCleanFile(
            buildGradle,
            buildGradle,
            [
                { pattern: " compile '", override: "  implementation '" },
                { pattern: ' compile "', override: '  implementation "' },
                { pattern: ' testCompile "', override: '  testImplementation "' },
                { pattern: " provided '", override: "  compileOnly '" },
                { pattern: ' provided "', override: '  compileOnly "' },
                {
                    pattern: ' compile fileTree',
                    override: '  implementation fileTree',
                },
            ],
            undefined,
            c
        );
    }
};

// const _getPrivateConfig = (c, platform) => {
//     let privateConfigFolder = path.join(c.paths.workspace.dir, c.files.project.package.name, c.buildConfig.id);
//     if (!fsExistsSync(privateConfigFolder)) {
//         privateConfigFolder = path.join(c.paths.workspace.dir, c.files.project.package.name, 'appConfigs', c.buildConfig.id);
//     }
//     const appConfigSPP = c.buildConfig.platforms[platform] ? c.buildConfig.platforms[platform].signingPropertiesPath : null;
//     const appConfigSPPClean = appConfigSPP ? appConfigSPP.replace('{globalConfigDir}', c.paths.workspace.dir) : null;
//     const privateConfigPath = appConfigSPPClean || path.join(privateConfigFolder, 'config.private.json');
//     c.paths.workspaceConfigPath = privateConfigPath;
//     c.paths.workspace.appConfig.dir = privateConfigPath.replace('/config.private.json', '');
//     if (fsExistsSync(privateConfigPath)) {
//         try {
//             const output = JSON.parse(fsReadFileSync(privateConfigPath));
//             output.parentFolder = c.paths.workspace.appConfig.dir;
//             output.path = privateConfigPath;
//             logInfo(
//                 `Found ${chalk().white(privateConfigPath)}. Will use it for production releases!`,
//             );
//             return output;
//         } catch (e) {
//             logError(e);
//             return null;
//         }
//     } else {
//         logWarning(
//             `You're missing ${chalk().white(privateConfigPath)} for this app: . You won't be able to make production releases without it!`,
//         );
//         return null;
//     }
// };
