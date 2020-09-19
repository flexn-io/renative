import React from 'react';
import { useRouter } from 'next/router';
import ScreenHome from '../components/screenHome';

export default () => (
    <ScreenHome router={useRouter()} />
);
