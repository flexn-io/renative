import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Theme from './theme';
import { Router, Link } from "@reach/router";

const styles = StyleSheet.create({
    container: {
        top: 0,
        flex: 1,
        backgroundColor: Theme.color1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '92vh',
    },
    textH2: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: Theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: Theme.color3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        fontFamily: 'TimeBurner',
        fontSize: 20,
        marginHorizontal: 20,
        color: Theme.color2,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const sections = [
    { id: '1', name: 'Section 1' },
    { id: '2', name: 'Section 2' }
];

const Root = ({ children }) => (
    <div>
        <nav>
            <Text style={styles.link}>
                <Link to="/my-page" style={{ color: 'inherit' }}>Sections</Link>
            </Text>
        </nav>
        {children}
    </div>
)

const Sections = (props) => (
    <div>
        <Text style={styles.textH2}>
        <h3 >Submenu</h3>
        <ul role='navigation'>
            {sections.map(section => (
                <li id={section.id}>
                    <Link style={{ color: 'inherit' }} to={section.id}>{section.name}</Link>
                </li>
            ))}
        </ul>
        </Text>
        {props.children}
    </div>
);

const Section = (props) => {
    return (
    <div>
        <Text style={styles.text}>
            <h2>Section {props.sectionId}</h2>
        </Text>
    </div>
)};

const ScreenMyPage = (props) => (
    <View style={styles.container}>
        <Text style={styles.textH2}>
            This is my Page!
        </Text>
        <Router>
            <Root path ='/'>
                <Section path='/:sectionId' />
                <Sections path='/'/>
            </Root>
        </Router>
    </View>
);

export default ScreenMyPage;
