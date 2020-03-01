import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Icon, getScaledValue, useNavigate, isEngineWeb, isFactorTv } from 'renative';
import { Link } from '@reach/router';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';
import { initNavigation, setKeyMap } from '@noriginmedia/react-spatial-navigation';
import Theme, { themeStyles, hasHorizontalMenu, hasWebFocusableUI } from './theme';
import MenuButton from './button';

// if (hasWebFocusableUI) {
//     initNavigation({
//         debug: false,
//         visualDebug: false,
//         nativeMode: false
//     });
// }

// const menuItems = [1, 2, 3, 4, 5];
// const styles2 = {
//     menuItem: { width: 100, height: 100, backgroundColor: 'yellow' },
//     focused: { width: 100, height: 100, backgroundColor: 'blue' }
// };

initNavigation({
    debug: false,
    visualDebug: false,
    nativeMode: false
});


// const LinkButton = isEngineWeb ? props => (
//     <Link
//         to={props.to}
//         getProps={({ isCurrent }) => ({
//             style: {
//                 color: isCurrent ? 'white' : 'transparent'
//             }
//         })}
//     >
//         <Button {...props} />
//     </Link>
// ) : props => (
//     <Button
//         {...props}
//     />
// );
//
// const MenuItem1 = ({ focused, stealFocus }) => (
//
//     <View
//         style={[styles2.menuItem, focused ? styles2.focused : null]}
//
//     >
//         <TouchableOpacity
//             onFocus={() => {
//                 console.log('SKJSKJSHKJSHSJK22');
//                 stealFocus();
//             }}
//             onPress={() => {
//                 console.log('SKJSKJSHKJSHSJK');
//             }}
//         />
//     </View>
//
// );
//
// const MenuItem = ({ focused, stealFocus, to, title }) => (
//     <Link
//         to={to}
//         getProps={({ isCurrent }) => ({
//             style: {
//                 color: isCurrent ? 'white' : 'transparent'
//             }
//         })}
//     >
//         <View
//             style={[styles2.menuItem, focused ? styles2.focused : null]}
//         >
//             <Text style={{}}>
//                 {title}
//             </Text>
//         </View>
//     </Link>
// );
// const MenuItemFocusable = withFocusable({ trackChildren: true })(MenuItem);
//
// const Menu = (props) => {
//     useEffect(() => {
//         props.setFocus('menukey');
//     }, []);
//     return (
//         <View style={styles.menu}>
//             <MenuItemFocusable
//                 title="Hello"
//                 to="/"
//                 onEnterPress={() => {
//                     console.log('SKJSKJSHKJSHSJKqqqqqq');
//                 }}
//             />
//             <MenuItemFocusable to="/my-page" title="MyPage" />
//             <MenuItemFocusable to="/modal" title="Modal" />
//         </View>
//     );
// };
// const MenuFocusable = withFocusable()(Menu);
//
// export default MenuFocusable;


// const Component = ({ focused, stealFocus }) => (
//     <TouchableOpacity>
//         <View style={[{ width: 50, height: 50 }, focused ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }]} />
//     </TouchableOpacity>
// );
// const LinkButton = withFocusable({
//     trackChildren: true,
//     forgetLastFocusedChild: true
// })(Component);

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
        paddingTop: getScaledValue(hasHorizontalMenu ? 20 : 40),
        paddingLeft: getScaledValue(hasHorizontalMenu ? 40 : 40),
        width: hasHorizontalMenu ? '100%' : 280,
        height: hasHorizontalMenu ? getScaledValue(80) : '100%',
        backgroundColor: Theme.color1,
        alignItems: 'flex-start',
        borderRightWidth: getScaledValue(hasHorizontalMenu ? 0 : 1),
        borderBottomWidth: getScaledValue(hasHorizontalMenu ? 1 : 0),
        borderColor: Theme.color5,
        flexDirection: hasHorizontalMenu ? 'row' : 'column'
    },
    button: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: hasHorizontalMenu ? getScaledValue(20) : 0,
        marginTop: hasHorizontalMenu ? 0 : getScaledValue(20),
        maxWidth: getScaledValue(400),
        minWidth: getScaledValue(50),
        borderWidth: 0,
    },
    buttonText: {
        fontFamily: 'TimeBurner',
        color: '#62DBFB',
        fontSize: getScaledValue(20),
    }
});

const Menu = (props) => {
    const navigate = useNavigate(props);
    if (hasWebFocusableUI) {
        useEffect(() => {
            props.setFocus();
        }, []);
    }

    return (
        <View style={styles.container}>
            <Text style={themeStyles.text}>
                    Menu
            </Text>
            <MenuButton
                to="/"
                title="Home"
                iconFont="ionicons"
                className="focusable"
                iconName="md-home"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('home');
                }}
                onEnterPress={() => {
                    navigate('/');
                }}
            />
            <MenuButton
                to="my-page"
                title="My Page"
                iconFont="ionicons"
                iconName="md-book"
                className="focusable"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('my-page');
                }}
                onEnterPress={() => {
                    navigate('my-page');
                }}
            />
            <MenuButton
                to="modal"
                title="My Modal"
                iconFont="ionicons"
                className="focusable"
                iconName="ios-albums"
                iconColor={Theme.color3}
                iconSize={Theme.iconSize}
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={() => {
                    navigate('modal');
                }}
                onEnterPress={() => {
                    navigate('modal');
                }}
            />
        </View>
    );
};

export default hasWebFocusableUI ? withFocusable()(Menu) : Menu;
