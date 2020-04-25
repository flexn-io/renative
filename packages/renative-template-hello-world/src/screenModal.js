import React, { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button, getScaledValue, usePop, StyleSheet } from 'renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import Theme, { themeStyles, hasWebFocusableUI } from './theme';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: getScaledValue(80),
        alignItems: 'flex-end',
        paddingTop: getScaledValue(20)
    }
});

const ScreenModal = props => {
    const pop = usePop(props);
    if (hasWebFocusableUI) {
        useEffect(() => {
            const { setFocus } = props;
            setFocus('close');

            return function cleanup() {
                setFocus('menu');
            };
        }, []);
    }
    return (
        <View style={themeStyles.screenModal}>
            <View style={styles.header}>
                <Button
                    focusKey="close"
                    iconFont="ionicons"
                    iconName="md-close-circle"
                    className="focusable"
                    iconColor={Theme.color3}
                    iconSize={Theme.iconSize}
                    style={themeStyles.icon}
                    to="/"
                    onEnterPress={() => {
                        pop();
                    }}
                    onPress={() => {
                        pop();
                    }}
                />
            </View>
            <ScrollView contentContainerStyle={themeStyles.container}>
                <Text style={themeStyles.textH2}>This is my Modal!</Text>
            </ScrollView>
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(ScreenModal) : ScreenModal);
