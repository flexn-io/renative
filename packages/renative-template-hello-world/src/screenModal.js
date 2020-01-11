import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon, Api, getScaledValue } from 'renative';
import Theme from './theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.color1,
    },
    containerIn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: getScaledValue(50),
        alignItems: 'flex-end',
        paddingRight: getScaledValue(40),
        paddingTop: getScaledValue(20)
    },
    textH2: {
        fontFamily: Theme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: Theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: getScaledValue(40),
        height: getScaledValue(40),
        marginLeft: getScaledValue(10)
    }
});

const ScreenMyPage = () => (
    <View style={styles.container}>
        <View style={styles.header}>
            <Icon
                iconFont="ionicons"
                iconName="md-close-circle"
                className="focusable"
                iconColor={Theme.color3}
                style={styles.icon}
                onPress={() => {
                    Api.navigation.pop();
                }}
            />
        </View>
        <View style={styles.containerIn}>
            <Text style={styles.textH2}>
                        This is my Modal!
            </Text>
        </View>
    </View>
);

export default ScreenMyPage;
