import React, { useEffect } from 'react';
import { View } from 'react-native';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Menu from '../components/Menu';
import ScreenHome from '../screens/Home';
import ScreenModal from '../screens/Modal';
import ScreenMyPage from '../screens/MyPage';
import { themeStyles } from '../config';

const NavBar = () => {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
                Home
            </NavLink>
            <NavLink
                to="/my-page"
                className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
                About
            </NavLink>
            <NavLink
                to="/modal"
                className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
                Contact
            </NavLink>
        </nav>
    );
};

const App = () => {
    useEffect(() => {
        // Required for tizen
        if (window.focus) window.focus();
    }, []);

    return (
        <View style={themeStyles.app}>

            <BrowserRouter>
                <Menu />
                <Routes>
                    <Route element={<ScreenHome />} path="/" />
                    <Route element={<ScreenMyPage />} path="my-page" />
                    <Route element={<ScreenModal />} path="modal" />
                </Routes>
            </BrowserRouter>

        </View>
    );
};

export default App;
