import React from 'react';
import { useRouter } from 'next/router';
import ScreenHome from '../components/screenHome';

const Page = () => (
    <ScreenHome router={useRouter()} />
);
export default Page;
