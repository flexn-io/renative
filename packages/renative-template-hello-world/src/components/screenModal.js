/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useContext } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button, usePop } from 'renative';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI } from '../config';

const ScreenModal = (props) => {
    const pop = usePop(props);
    const { theme } = useContext(ThemeContext);

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
        <View style={theme.styles.screenModal}>
            <View style={theme.styles.modalHeader}>
                <Button
                    focusKey="close"
                    iconFont="ionicons"
                    iconName="md-close-circle"
                    className="focusable"
                    iconColor={theme.static.colorBrand}
                    iconSize={theme.static.buttonSize}
                    style={theme.styles.icon}
                    // to="/"
                    onEnterPress={() => {
                        pop();
                    }}
                    onPress={() => {
                        pop();
                    }}
                />
            </View>
            <ScrollView contentContainerStyle={theme.styles.container}>
                <Text style={theme.styles.textH2}>This is my Modal!</Text>
            </ScrollView>
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(ScreenModal) : ScreenModal);
