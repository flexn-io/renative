/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useContext } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { ThemeContext, hasWebFocusableUI } from '../config';
import { testProps } from '../utils';
import Button from '../components/Button';
import { usePop } from '../hooks/navigation';

const ScreenModal = ({ navigation, setFocus }) => {
    const pop = usePop(navigation);
    const { theme }: any = useContext(ThemeContext);

    if (hasWebFocusableUI) {
        useEffect(() => {
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
                    onEnterPress={() => { pop(); }}
                    onPress={() => { pop(); }}
                    {...testProps('template-starter-modal-screen-close-button')}
                />
            </View>
            <ScrollView contentContainerStyle={theme.styles.container} {...testProps('template-starter-modal-screen-text-container')}>
                <Text style={theme.styles.textH2}>This is my Modal!</Text>
            </ScrollView>
        </View>
    );
};

export default (hasWebFocusableUI ? withFocusable()(ScreenModal) : ScreenModal);
