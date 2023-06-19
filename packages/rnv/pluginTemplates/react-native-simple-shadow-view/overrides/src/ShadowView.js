// OVERRIDEN
import React, { Component } from 'react';
import { requireNativeComponent, Platform, View } from 'react-native';

export const RNTShadowView = requireNativeComponent('RNTShadowView', ShadowView);

class ShadowView extends Component {
    constructor(props) {
        super(props);
    }

    _getBackgroundColor(backgroundColor) {
        if (backgroundColor) {
            if (backgroundColor === 'transparent' || backgroundColor.replace(' ', '') === 'rgba(0,0,0,0)') {
                return 'rgba(0,0,0,0.001)'
            }
        }

        return backgroundColor !== undefined && typeof backgroundColor === 'string' ? backgroundColor : undefined;
     };

    render() {
        if (Platform.OS === 'ios') {
            return (
                <View
                    {...this.props}
                />
            );
        }
        const { style } = this.props || {};
        let flattenedStyle = {};
        if (Array.isArray(style)) {
            style.map((item) => {
                item && Object.keys(item) && Object.keys(item).map(key => flattenedStyle[key] = item[key]);
            });
        } else {
            flattenedStyle = style || {};
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

        if (!shadowRadius || shadowOpacity === 0) {
            return (<View {...this.props} />);
        }

        const { width: shadowOffsetX, height: shadowOffsetY } = shadowOffset || {};

        return (
            <RNTShadowView
                {...this.props}
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
            >
                {this.props.children}
            </RNTShadowView>
        );
    }
}

export default ShadowView;
