/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

 import React from 'react';
 import * as Animatable from 'react-native-animatable';
 import { Easing, TouchableWithoutFeedback, Animated } from 'react-native';
 import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';
 import {PressabilityDebugView} from 'react-native/Libraries/Pressability/PressabilityDebug';
 import Pressability, { type PressabilityConfig } from 'react-native/Libraries/Pressability/Pressability';
 
 import { RNTShadowView } from './ShadowView';
  
 type TVProps = $ReadOnly<{|
     hasTVPreferredFocus?: ?boolean,
     nextFocusDown?: ?number,
     nextFocusForward?: ?number,
     nextFocusLeft?: ?number,
     nextFocusRight?: ?number,
     nextFocusUp?: ?number,
   |}>;
   
   type Props = $ReadOnly<{|
     ...React.ElementConfig<TouchableWithoutFeedback>,
     ...TVProps,
   
     activeOpacity?: ?number,
     style?: ?ViewStyleProp,
   
     hostRef: React.Ref<typeof Animated.View>,
   |}>;
   
   type State = $ReadOnly<{|
     anim: Animated.Value,
     pressability: Pressability,
   |}>;
   
 
 class ShadowViewTouchable extends React.Component<Props, State> {
 
     state: State = {
       anim: new Animated.Value(this._getChildStyleOpacityWithDefault()),
       pressability: new Pressability(this._createPressabilityConfig()),
     };
 
     ref = React.createRef();
   
     _createPressabilityConfig(): PressabilityConfig {
       return {
         cancelable: !this.props.rejectResponderTermination,
         disabled: this.props.disabled,
         hitSlop: this.props.hitSlop,
         delayLongPress: this.props.delayLongPress,
         delayPressIn: this.props.delayPressIn,
         delayPressOut: this.props.delayPressOut,
         minPressDuration: 0,
         pressRectOffset: this.props.pressRetentionOffset,
         onBlur: event => {
           if (this.props.onBlur != null) {
             this.props.onBlur(event);
           }
         },
         onFocus: event => {
           if (this.props.onFocus != null) {
             this.props.onFocus(event);
           }
         },
         onLongPress: this.props.onLongPress,
         onPress: this.props.onPress,
         onPressIn: event => {
           this._opacityActive(
             event.dispatchConfig.registrationName === 'onResponderGrant'
               ? 0
               : 150,
           );
           if (this.props.onPressIn != null) {
             this.props.onPressIn(event);
           }
         },
         onPressOut: event => {
           this._opacityInactive(250);
           if (this.props.onPressOut != null) {
             this.props.onPressOut(event);
           }
         },
       };
     }
   
     /**
      * Animate the touchable to a new opacity.
      */
     _setOpacityTo(toValue: number, duration: number): void {
       Animated.timing(this.state.anim, {
         toValue,
         duration,
         easing: Easing.inOut(Easing.quad),
         useNativeDriver: false,
       }).start();
     }
   
     _opacityActive(duration: number): void {
      //  this._setOpacityTo(this.props.activeOpacity ?? 0.2, duration);
       this.ref.current.setNativeProps({
         style: {
           opacity: 0.2
         }
       })
     }
   
     _opacityInactive(duration: number): void {
      //  this._setOpacityTo(this._getChildStyleOpacityWithDefault(), duration);
       this.ref.current.setNativeProps({
         style: {
           opacity: this._getChildStyleOpacityWithDefault()
         }
       })
     }
   
     _getChildStyleOpacityWithDefault(): number {
       const opacity = flattenStyle(this.props.style)?.opacity;
       return typeof opacity === 'number' ? opacity : 1;
     }

     _getBackgroundColor(backgroundColor): string {
        if (backgroundColor) {
          if (backgroundColor === 'transparent' || backgroundColor.replace(' ', '') === 'rgba(0,0,0,0)') {
            return 'rgba(0,0,0,0.001)'
          }
        }

        return backgroundColor !== undefined && typeof backgroundColor === 'string' ? backgroundColor : undefined;
     };
 
     render() {
         const { style } = this.props || {};
         const styles = {...style};
         let flattenedStyle = {};
         if (Array.isArray(styles)) {
           styles.map((item) => {
                 item && Object.keys(item) && Object.keys(item).map(key => flattenedStyle[key] = item[key]);
             });
         } else {
             flattenedStyle = styles || {};
         }
 
         delete flattenedStyle.elevation;
 
         const {
             shadowColor,
             shadowOffset,
             shadowOpacity,
             shadowRadius,
             borderRadius,
             backgroundColor,
             borderWidth,
             borderColor,
         } = flattenedStyle;
 
         const {
           onBlur,
           onFocus,
           ...eventHandlersWithoutBlurAndFocus
         } = this.state.pressability.getEventHandlers();
 
         const { width: shadowOffsetX, height: shadowOffsetY } = shadowOffset || {};
         
         return (
             <RNTShadowView
                 style={[flattenedStyle]}
                 borderWidth={borderWidth}
                 borderColor={borderColor !== undefined && typeof borderColor === 'string' ? borderColor : undefined}
                 backgroundColor={this._getBackgroundColor(backgroundColor)}
                 shadowColor={shadowColor !== undefined && typeof shadowColor === 'string' ? shadowColor : undefined}
                 shadowBorderRadius={borderRadius}
                 shadowOffsetX={shadowOffsetX}
                 shadowOffsetY={shadowOffsetY}
                 shadowOpacity={(shadowOpacity !== undefined ? shadowOpacity : 0)}
                 shadowRadius={(shadowRadius !== undefined ? shadowRadius : 2.8)}
                 accessible={this.props.accessible !== false}
                 accessibilityLabel={this.props.accessibilityLabel}
                 accessibilityHint={this.props.accessibilityHint}
                 accessibilityRole={this.props.accessibilityRole}
                 accessibilityState={this.props.accessibilityState}
                 accessibilityActions={this.props.accessibilityActions}
                 onAccessibilityAction={this.props.onAccessibilityAction}
                 accessibilityValue={this.props.accessibilityValue}
                 importantForAccessibility={this.props.importantForAccessibility}
                 accessibilityLiveRegion={this.props.accessibilityLiveRegion}
                 accessibilityViewIsModal={this.props.accessibilityViewIsModal}
                 accessibilityElementsHidden={this.props.accessibilityElementsHidden}
                 nativeID={this.props.nativeID}
                 testID={this.props.testID}
                 onLayout={this.props.onLayout}
                 nextFocusDown={this.props.nextFocusDown}
                 nextFocusForward={this.props.nextFocusForward}
                 nextFocusLeft={this.props.nextFocusLeft}
                 nextFocusRight={this.props.nextFocusRight}
                 nextFocusUp={this.props.nextFocusUp}
                 hasTVPreferredFocus={this.props.hasTVPreferredFocus}
                 hitSlop={this.props.hitSlop}
                 focusable={
                   this.props.focusable !== false && this.props.onPress !== undefined
                 }
                 ref={this.ref}
                 {...eventHandlersWithoutBlurAndFocus}>
                 {this.props.children}
                 {__DEV__ ? (
                   <PressabilityDebugView color="cyan" hitSlop={this.props.hitSlop} />
                 ) : null}
             </RNTShadowView>
         );
     }
 
       componentDidUpdate(prevProps: Props, prevState: State) {
         this.state.pressability.configure(this._createPressabilityConfig());
         if (this.props.disabled !== prevProps.disabled) {
           this._opacityInactive(250);
         }
       }
     
       componentWillUnmount(): void {
         this.state.pressability.reset();
       }
 }
 
 module.exports = ShadowViewTouchable;
 