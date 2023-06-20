/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2016-present, Ali Najafizadeh
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule WebViewBridge
 */


const React = require('react');
const PropTypes = require('prop-types');
const ReactNative = require('react-native');
const createReactClass = require('create-react-class');
const invariant = require('invariant');
const keyMirror = require('keymirror');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

const WebView = require('react-native-webview');

const {
    ReactNativeViewAttributes,
    UIManager,
    EdgeInsetsPropType,
    StyleSheet,
    Text,
    View,
    ViewPropTypes,
    requireNativeComponent,
    DeviceEventEmitter,
    NativeModules: {
        WebViewBridgeManager
    }
} = ReactNative;

const RCT_WEBVIEWBRIDGE_REF = 'webviewbridge';

const WebViewBridgeState = keyMirror({
    IDLE: null,
    LOADING: null,
    ERROR: null,
});

const RCTWebViewBridge = requireNativeComponent('RCTWebViewBridge', WebViewBridge);

/**
 * Renders a native WebView.
 */
var WebViewBridge = createReactClass({

    propTypes: {
        ...RCTWebViewBridge.propTypes,

        /**
     * Will be called once the message is being sent from webview
     */
        onBridgeMessage: PropTypes.func,
    },

    getInitialState() {
        return {
            viewState: WebViewBridgeState.IDLE,
            lastErrorEvent: null,
            startInLoadingState: true,
        };
    },


    componentDidMount() {
        DeviceEventEmitter.addListener('webViewBridgeMessage', (body) => {
            const { onBridgeMessage } = this.props;
            const { message } = body;
            if (onBridgeMessage) {
                onBridgeMessage(message);
            }
        });

        if (this.props.startInLoadingState) {
            this.setState({ viewState: WebViewBridgeState.LOADING });
        }
    },

    render() {
        let otherView = null;

        if (this.state.viewState === WebViewBridgeState.LOADING) {
            otherView = this.props.renderLoading && this.props.renderLoading();
        } else if (this.state.viewState === WebViewBridgeState.ERROR) {
            const errorEvent = this.state.lastErrorEvent;
            otherView = this.props.renderError && this.props.renderError(
                errorEvent.domain,
                errorEvent.code,
                errorEvent.description
            );
        } else if (this.state.viewState !== WebViewBridgeState.IDLE) {
            console.error(`RCTWebViewBridge invalid state encountered: ${this.state.loading}`);
        }

        const webViewStyles = [styles.container, this.props.style];
        if (this.state.viewState === WebViewBridgeState.LOADING
      || this.state.viewState === WebViewBridgeState.ERROR) {
            // if we're in either LOADING or ERROR states, don't show the webView
            webViewStyles.push(styles.hidden);
        }

        let { javaScriptEnabled, domStorageEnabled } = this.props;
        if (this.props.javaScriptEnabledAndroid) {
            console.warn('javaScriptEnabledAndroid is deprecated. Use javaScriptEnabled instead');
            javaScriptEnabled = this.props.javaScriptEnabledAndroid;
        }
        if (this.props.domStorageEnabledAndroid) {
            console.warn('domStorageEnabledAndroid is deprecated. Use domStorageEnabled instead');
            domStorageEnabled = this.props.domStorageEnabledAndroid;
        }

        const { source, ...props } = { ...this.props };

        const webView = (
            <RCTWebViewBridge
                ref={RCT_WEBVIEWBRIDGE_REF}
                key="webViewKey"
                javaScriptEnabled
                {...props}
                source={resolveAssetSource(source)}
                style={webViewStyles}
                onLoadingStart={this.onLoadingStart}
                onLoadingFinish={this.onLoadingFinish}
                onLoadingError={this.onLoadingError}
                onChange={this.onMessage}
            />
        );

        return (
            <View style={styles.container}>
                {webView}
                {otherView}
            </View>
        );
    },

    onMessage(event) {
        if (this.props.onBridgeMessage != null && event.nativeEvent != null) {
            this.props.onBridgeMessage(event.nativeEvent.message);
        }
    },

    goForward() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewBridgeHandle(),
            UIManager.RCTWebViewBridge.Commands.goForward,
            null
        );
    },

    goBack() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewBridgeHandle(),
            UIManager.RCTWebViewBridge.Commands.goBack,
            null
        );
    },

    reload() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewBridgeHandle(),
            UIManager.RCTWebViewBridge.Commands.reload,
            null
        );
    },

    sendToBridge(message: string) {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewBridgeHandle(),
            UIManager.RCTWebViewBridge.Commands.sendToBridge,
            [message]
        );
    },

    /**
   * We return an event with a bunch of fields including:
   *  url, title, loading, canGoBack, canGoForward
   */
    updateNavigationState(event) {
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event.nativeEvent);
        }
    },

    getWebViewBridgeHandle() {
        return ReactNative.findNodeHandle(this.refs[RCT_WEBVIEWBRIDGE_REF]);
    },

    onLoadingStart(event) {
        const { onLoadStart } = this.props;
        onLoadStart && onLoadStart(event);
        this.updateNavigationState(event);
    },

    onLoadingError(event) {
        event.persist(); // persist this event because we need to store it
        const { onError, onLoadEnd } = this.props;
        onError && onError(event);
        onLoadEnd && onLoadEnd(event);

        this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState: WebViewBridgeState.ERROR
        });
    },

    onLoadingFinish(event) {
        const { onLoad, onLoadEnd } = this.props;
        onLoad && onLoad(event);
        onLoadEnd && onLoadEnd(event);
        this.setState({
            viewState: WebViewBridgeState.IDLE,
        });
        this.updateNavigationState(event);
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hidden: {
        height: 0,
        flex: 0, // disable 'flex:1' when hiding a View
    },
});

module.exports = WebViewBridge;
