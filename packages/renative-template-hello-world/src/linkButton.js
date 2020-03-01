import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Api, getScaledValue, useNavigate, isWeb, Button } from 'renative';
import { Link } from '@reach/router';
import { isTopMenuBased } from './nav';
import Theme from './theme';


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

export default LinkButton;
