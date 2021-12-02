import React from 'react';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const App = () => (
    <ThemeProvider>
        <Navigation />
    </ThemeProvider>
);

export default App;
