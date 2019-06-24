# Sanity Pack

These commands must work IN ReNative REPO and STANDALONE apps

## Commands PRIORITY 1

```
rnv new
rnv run
rnv run -p android
rnv run -p ios
rnv run -p web
rnv run -p tizen
rnv run -p webos
rnv run -p androidtv
rnv run -p tvos
rnv run -p macos
rnv run -p androidwear
rnv run -p tizenwatch
rnv platform eject
rnv target list
```

## Android

Given:
- ~/.rnv config exists
- No Simulators or Devices are connected

When: `rnv run`
Then:
- I get option to pick platforms (=> given android was picked)
- I get options to pick Simulator to launch
- simulator launches
- app runs on simulator in debug mode

When: `rnv run -p android`
Then:
- I get options to pick Simulator to launch,
- simulator launches
- app runs on simulator in debug mode

When: `rnv run -p android -s ?`
Then:
- I get option to pick build scheme
- I get options to pick Simulator to launch
- simulator launches
- app runs on simulator in debug mode

When: `rnv run -p android -d`
Then:
- I see warning that no devices are connected
- I see option press Enter to retry OR ip address (=> given valid IP address was entered)
- app runs on device in debug mode

## iOS

Given:
- ~/.rnv config exists
- No Simulators or Devices are connected

When: `rnv run`
Then:
- I get option to pick platforms (=> given ios was picked)
- I get options to pick Simulator to launch
- simulator launches
- app runs on simulator in debug mode

When: `rnv run -p ios`
Then:
- I get options to pick Simulator to launch,
- simulator launches
- app runs on simulator in debug mode

When: `rnv run -p ios -s ?`
Then:
- I get option to pick build scheme
- I get options to pick Simulator to launch
- simulator launches
- app runs on simulator in debug mode

Given: no ios devices are connected
When: `rnv run -p ios -d`
Then:
- I see warning that no devices are connected
- app runs on device in debug mode

Given: 1 ios device is connected
When: `rnv run -p ios -d`
Then:
- app runs on device in debug mode

Given: 2 ios devices are connected
When: `rnv run -p ios -d`
Then:
- I get option to select device to run app on
- (=> when I pick one of the devices)
- app runs on device in debug mode
