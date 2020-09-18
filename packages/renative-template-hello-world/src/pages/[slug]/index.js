import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { View } from 'react-native';
import ScreenHome from '../../components/screenHome';
import ScreenMyPage from '../../components/screenMyPage';
import ScreenModal from '../../components/screenModal';

const pages = {
    '/': ScreenHome,
    'my-page': ScreenMyPage,
    modal: ScreenModal
};

const App = () => {
    const router = useRouter();
    useEffect(() => {
    }, [router.asPath]);
    const Page = pages[router.query?.slug] || View;

    return (
        <Page router={router} />
    );
};

export default App;
