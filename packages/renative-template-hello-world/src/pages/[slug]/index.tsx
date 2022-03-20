import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { View } from 'react-native';
import ScreenHome from '../../screens/Home';
import ScreenModal from '../../screens/Modal';
import ScreenMyPage from '../../screens/MyPage';
import { ROUTES } from '../../config';

const pages = {};
pages[ROUTES.HOME] = ScreenHome;
pages[ROUTES.MY_PAGE] = ScreenMyPage;
pages[ROUTES.MODAL] = ScreenModal;

const App = () => {
    const router = useRouter();
    useEffect(() => {
    }, [router.asPath]);
    const slug: string = router.query?.slug as string
    const Page = pages[slug] || View;

    return (
        <Page router={router} />
    );
};

export default App;
