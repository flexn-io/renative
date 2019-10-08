import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Api, Button } from 'renative';
import { isTopMenuBased } from './nav';
import { Link } from "@reach/router";
import Theme from './theme';

let isTop;

const styles = StyleSheet.create({
    containerVertical: {
        paddingTop: 40,
        paddingLeft: 20,
        width: '100%',
        height: '100%',
        backgroundColor: Theme.color1,
        borderRightWidth: 1,
        borderRightColor: '#AAAAAA',
        flexDirection: 'column',
        position: 'sticky',
        alignItems: 'flex-start'

},
    containerHorizontal: {
        paddingLeft: 40,
        width: '100%',
        backgroundColor: Theme.color1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#AAAAAA',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'TimeBurner',
        color: Theme.color4,
        fontSize: 20,
        marginTop: 10,
        textAlign: 'left',
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: 20,
        maxWidth: 400,
        minWidth: 50,
        borderWidth: 0,
    },
});

const NavLink = props => (
    <Link
        {...props}
        getProps={({ isCurrent }) => {
            // the object returned here is passed to the
            // anchor element's props
            return {
                style: {
                    color: isCurrent ? "white" : "transparent"
                }
            };
        }}
    />
);

class Menu extends React.Component {
    constructor(props) {
        super(props);
        isTop = isTopMenuBased();
    }

    render() {
        return (
            <View style={[isTop ? styles.containerHorizontal : styles.containerVertical, this.props.style]}>
                <Text style={styles.text}>
                    Menu
                </Text>
                <NavLink to="/">
                    <Button
                        title="Home"
                        iconFont="ionicons"
                        className="focusable"
                        iconName="md-home"
                        iconColor={Theme.color3}
                        style={styles.button}
                        onPress={() => {
                            // Api.navigation.navigate('Home', {
                            //     onSuccess: () => {
                            //
                            //     }
                            // });
                        }}
                />
                </NavLink>
                <NavLink to="/my-page">
                    <Button
                        title="My Page"
                        iconFont="ionicons"
                        iconName="md-book"
                        className="focusable"
                        iconColor={Theme.color3}
                        style={styles.button}
                        onPress={() => {
                            // Api.navigation.navigate('MyPage');
                        }} />
                </NavLink>
                <NavLink to="/modal">
                    <Button
                        title="My Modal"
                        iconFont="ionicons"
                        className="focusable"
                        iconName="ios-albums"
                        iconColor={Theme.color3}
                        style={styles.button}
                        onPress={() => {
                           // Api.navigation.navigate('MyModal');
                        }}
                    />
                </NavLink>
            </View>
        );
    }
}

export default Menu;
