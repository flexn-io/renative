# Sanity Pack

These commands must work IN ReNative REPO and STANDALONE apps

## Android

Given: No Simulators or Devices are connected

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
