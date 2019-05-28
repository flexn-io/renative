import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';

const IconMap = {
    fontAwesome: require('react-native-vector-icons/FontAwesome').default,
    feather: require('react-native-vector-icons/Feather').default,
    antDesign: require('react-native-vector-icons/AntDesign').default,
    entypo: require('react-native-vector-icons/Entypo').default,
    evilIcons: require('react-native-vector-icons/EvilIcons').default,
    foundation: require('react-native-vector-icons/Foundation').default,
    ionicons: require('react-native-vector-icons/Ionicons').default,
    materialCommunityIcons: require('react-native-vector-icons/MaterialCommunityIcons').default,
    materialIcons: require('react-native-vector-icons/MaterialIcons').default,
    octicons: require('react-native-vector-icons/Octicons').default,
    simpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
    zocial: require('react-native-vector-icons/Zocial').default,
};

export default class IconComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { iconFont, iconName, iconColor, onPress, style } = this.props;
        const IC = IconMap[iconFont];
        return (
            <TouchableOpacity style={style} onPress={onPress}>
                <IC style={{ color: iconColor }} name={iconName} size={style.width || style.height} />
            </TouchableOpacity>
        );
    }
}
