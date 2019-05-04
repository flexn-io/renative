# ReNativeCLI

Commands:

```
//common.js
rnv --help              //Print help
rnv --version           //Print ReNativeVersion

//runner.js
rnv run                 //Run app on simulator/device/browser
rnv package             //Package JS bundles
rnv build               //Build standalone package/app
rnv deploy              //Deploy app
rnv update              //Force Update Dependencies
rnv test                //Run Tests
rnv doc                 //Generate documentation

//target.js
rnv target create       //Create new target (i.e. simulator/ emulator)
rnv target remove       //Remove target (i.e. simulator/ emulator)
rnv target start        //Start target (i.e. simulator/ emulator)
rnv target quit         //Terminate target (i.e. simulator/ emulator)
rnv target list         //List of available targets (i.e. simulator/ emulator)

//app.js
rnv app configure       //Configure app based on selected appConfig (copy runtime, initialise, copy assets, versions)
rnv app switch          //Switch app to new appConfig (only copy runtime)
rnv app create          //Create new appConfig
rnv app remove          //Remove selected appConfig
rnv app list            //List available appConfigs
rnv app info            //Get info about current app configuration

//platform.js
rnv platform create  //Recreate all platformBuilds projects for selected appConfig
rnv platform update  //Update all platformBuilds projects for selected appConfig
rnv platform list       //List available platform templates
rnv platform add        //Add new platform to current appConfig
rnv platform remove     //Remove selected platform from current appConfig

//plugin.js
rnv plugin:add          //Add new plugin to current appConfig
rnv plugin:remove       //Remove existing plugin from current appConfig
rnv plugin:list         //List all installed plugins for current appConfig

```

Examples:

```
rnv setup

rnv platform configure -c helloWorld

rnv app configure -c helloWorld

rnv app configure -c helloWorld -u

rnv run -p ios -t "iPhone 6"
rnv run -p tvos
rnv run -p tizen
rnv run -p web
rnv run -p tizen -t T-samsung-5.0-x86
rnv run -p webos -t emulator
rnv run -p android
rnv run -p androidtv
rnv run -p androidwear
rnv run -p macos
rnv run -p windows

rnv target launch -p android -t Nexus_5X_API_26
rnv target launch -p androidtv -t Android_TV_720p_API_22
rnv target launch -p androidwear -t Android_Wear_Round_API_28
rnv target launch -p tizen -t T-samsung-5.0-x86
rnv target launch -p webos -t emulator


```
