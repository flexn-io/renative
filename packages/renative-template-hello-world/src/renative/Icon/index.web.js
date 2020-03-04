import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const IconComponent = ({
    iconFont, iconName, iconColor, onPress, style, className, testID, size
}) => {

    return (
        <View style={style} className={className} testID={testID}>

        </View>
    );
};

export default IconComponent;
