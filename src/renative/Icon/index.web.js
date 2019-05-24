import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import Icon from 'react-web-vector-icons';

const FontNameMap = {
    fontAwesome: 'FontAwesome',
    feather: 'Feather',
    antDesign: 'AntDesign',
    entypo: 'Entypo',
    evilIcons: 'EvilIcons',
    foundation: 'Foundation',
    ionicons: 'Ionicons',
    materialCommunityIcons: 'MaterialCommunityIcons',
    materialIcons: 'MaterialIcons',
    octicons: 'Octicons',
    simpleLineIcons: 'SimpleLineIcons',
    zocial: 'Zocial',
};

export default class IconComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { iconFont, iconName, iconColor, onPress, style } = this.props;

        return (
            <TouchableOpacity style={style} onPress={onPress}>
                <Icon font={FontNameMap[iconFont]} color={iconColor} name={iconName} size={style.width || style.height} />
            </TouchableOpacity>
        );
    }
}
