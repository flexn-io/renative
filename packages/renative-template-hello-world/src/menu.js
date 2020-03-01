import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Api, Button, getScaledValue, useNavigate, isWeb } from 'renative';
import { Link } from '@reach/router';
import { isTopMenuBased } from './nav';
import Theme, { themeStyles } from './theme';

const LinkButton = isWeb() ? props => (
    <Link
        {...props}
        getProps={({ isCurrent }) => ({
            style: {
                color: isCurrent ? 'white' : 'transparent'
            }
        })}
    >
        <Button {...props} />
    </Link>
) : props => (
    <Button
        {...props}
    />
);

const styles = StyleSheet.create({
    container: {
        paddingTop: getScaledValue(isWeb() ? 0 : 40),
        paddingLeft: getScaledValue(isWeb() ? 40 : 20),
        width: '100%',
        height: '100%',
        backgroundColor: Theme.color1,
        alignItems: 'center',
        borderRightWidth: getScaledValue(isWeb() ? 0 : 1),
        borderBottomWidth: getScaledValue(isWeb() ? 1 : 0),
        borderColor: Theme.color5,
        flexDirection: isWeb() ? 'row' : 'column'
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0,
    },
});


const Menu = (props) => {
    const navigate = useNavigate(props);
    return (
        <View style={styles.container}>
            <Text style={themeStyles.text}>
                    Menu
            </Text>
            <LinkButton
                to="/"
                title="Home"
                iconFont="ionicons"
                className="focusable"
                iconName="md-home"
                iconColor={Theme.color3}
                style={styles.button}
                onPress={() => {
                    navigate('home');
                }}
            />
            <LinkButton
                to="my-page"
                title="My Page"
                iconFont="ionicons"
                iconName="md-book"
                className="focusable"
                iconColor={Theme.color3}
                style={styles.button}
                onPress={() => {
                    navigate('my-page');
                }}
            />
            <LinkButton
                to="modal"
                title="My Modal"
                iconFont="ionicons"
                className="focusable"
                iconName="ios-albums"
                iconColor={Theme.color3}
                style={styles.button}
                onPress={() => {
                    navigate('my-modal');
                }}
            />
        </View>
    );
};

export default Menu;
