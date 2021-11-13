"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Parses the output of the `xcrun instruments -s` command and returns metadata
 * about available iOS simulators and physical devices, as well as host Mac for
 * Catalyst purposes.
 *
 * Expected text looks roughly like this:
 *
 * ```
 * == Devices ==
 * this-mac-device [UDID]
 * A Physical Device (OS Version) (UDID)
 *
 * == Simulators ==
 * A Simulator Device (OS Version) (UDID)
 * ```
 */
function parseIOSDevicesList(text) {
  const devices = [];
  let isSimulator = false;

  if (text.indexOf('== Simulators ==') === -1) {
    return [];
  }

  text.split('\n').forEach(line => {
    if (line === '== Simulators ==') {
      isSimulator = true;
    }

    const device = line.match(/(.*?) (\(([0-9.]+)\) )?\(([0-9A-F-]+)\)/i);

    if (device) {
      const [, name,, version, udid] = device;
      const metadata = {
        name,
        udid
      };

      if (version) {
        metadata.version = version;
        metadata.type = isSimulator ? 'simulator' : 'device';
      } else {
        metadata.type = 'catalyst';
      }

      devices.push(metadata);
    }
  });
  return devices;
}

var _default = parseIOSDevicesList;
exports.default = _default;

//# sourceMappingURL=parseXctraceIOSDevicesList.js.map