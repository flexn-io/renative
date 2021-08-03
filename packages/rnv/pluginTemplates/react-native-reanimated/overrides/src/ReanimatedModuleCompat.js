export default {
  async disconnectNodeFromView() {
    // noop
  },
  async attachEvent(viewTag, eventName, nodeID) {
    // noop
  },
  async detachEvent(viewTag, eventName, nodeID) {
    // noop
  },
  async createNode(nodeID, config) {
    // noop
  },
  async dropNode(nodeID) {
    // noop
  },
  async configureProps() {
    // noop
  },
  async disconnectNodes() {
    // noop
  },

  // ↓↓↓ ReNative overrides ↓↓↓ (temp fix for macOS platform (rn-macos engine) until `react-native` and `react-native-renaimated` versions upgrade)
  async addListener() {
    // noop
  },
  async removeListeners() {
    // noop
  },
  async removeAllListeners() {
    // noop
  },
  // ↑↑↑ ReNative overrides ↑↑↑

  async animateNextTransition() {
    console.warn('Reanimated: animateNextTransition is unimplemented on current platform');
  },
};
