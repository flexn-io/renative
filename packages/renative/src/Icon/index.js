/* eslint-disable react/prop-types */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const fontAwesome = require('react-native-vector-icons/FontAwesome').default;
const feather = require('react-native-vector-icons/Feather').default;
const antDesign = require('react-native-vector-icons/AntDesign').default;
const entypo = require('react-native-vector-icons/Entypo').default;
const evilIcons = require('react-native-vector-icons/EvilIcons').default;
const foundation = require('react-native-vector-icons/Foundation').default;
const ionicons = require('react-native-vector-icons/Ionicons').default;
// const materialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons')
//     .default;
const materialIcons = require('react-native-vector-icons/MaterialIcons')
    .default;
const octicons = require('react-native-vector-icons/Octicons').default;
const simpleLineIcons = require('react-native-vector-icons/SimpleLineIcons')
    .default;
const zocial = require('react-native-vector-icons/Zocial').default;

const IconMap = {
    fontAwesome,
    feather,
    antDesign,
    entypo,
    evilIcons,
    foundation,
    ionicons,
    // materialCommunityIcons,
    materialIcons,
    octicons,
    simpleLineIcons,
    zocial
};

const IconComponent = ({
    iconFont,
    iconName,
    iconColor,
    onPress,
    style,
    className,
    testID,
    size
}) => {
    const IC = IconMap[iconFont];
    if (onPress) {
        return (
            <TouchableOpacity
                style={style}
                onPress={onPress}
                className={className}
                testID={testID}
            >
                <IC
                    style={{ color: iconColor }}
                    name={iconName}
                    size={size || style.width || style.height}
                />
            </TouchableOpacity>
        );
    }
    return (
        <View style={style} className={className} testID={testID}>
            <IC
                style={{ color: iconColor }}
                name={iconName}
                size={size || style.width || style.height}
            />
        </View>
    );
};

export default IconComponent;
