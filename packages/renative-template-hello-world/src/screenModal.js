import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon, getScaledValue, usePop } from 'renative';
import Theme, { themeStyles } from './theme';

const styles = StyleSheet.create({
    containerIn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        width: '100%',
        height: getScaledValue(80),
        alignItems: 'flex-end',
        paddingTop: getScaledValue(20)
    }
});

const ScreenModal = (props) => {
    const pop = usePop(props);
    return (
        <View style={themeStyles.modalContainer}>
            <View style={styles.header}>
                <Icon
                    iconFont="ionicons"
                    iconName="md-close-circle"
                    className="focusable"
                    iconColor={Theme.color3}
                    size={Theme.iconSize}
                    style={themeStyles.icon}
                    onPress={() => {
                        pop();
                    }}
                />
            </View>
            <View style={styles.containerIn}>
                <Text style={themeStyles.textH2}>
                        This is my Modal!
                </Text>
            </View>
        </View>
    );
};

export default ScreenModal;
