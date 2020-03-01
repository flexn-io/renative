import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Button, Icon, getScaledValue, useNavigate, isEngineWeb } from 'renative';
import { Link } from '@reach/router';
import Theme, { themeStyles, isHorizontalMenu } from './theme';

const LinkButton = isEngineWeb ? props => (
    <Link
        to={props.to}
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

export const DrawerButton = ({ navigation }) => (
    <Icon
        iconFont="ionicons"
        iconName="md-menu"
        iconColor={Theme.color3}
        style={themeStyles.icon}
        onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
        }}
    />
);

const styles = StyleSheet.create({
    container: {
        paddingTop: getScaledValue(isHorizontalMenu ? 20 : 40),
        paddingLeft: getScaledValue(isHorizontalMenu ? 40 : 40),
        width: isHorizontalMenu ? '100%' : 280,
        height: isHorizontalMenu ? getScaledValue(80) : '100%',
        backgroundColor: Theme.color1,
        alignItems: 'flex-start',
        borderRightWidth: getScaledValue(isHorizontalMenu ? 0 : 1),
        borderBottomWidth: getScaledValue(isHorizontalMenu ? 1 : 0),
        borderColor: Theme.color5,
        flexDirection: isHorizontalMenu ? 'row' : 'column'
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: isHorizontalMenu ? getScaledValue(20) : 0,
        marginTop: isHorizontalMenu ? 0 : getScaledValue(20),
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
                    navigate('modal');
                }}
            />
        </View>
    );
};

export default Menu;
