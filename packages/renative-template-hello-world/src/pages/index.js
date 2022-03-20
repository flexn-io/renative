import React from 'react';
import { useRouter } from 'next/router';
import ScreenHome from '../screens/Home';

const Page = () => (
    <ScreenHome router={useRouter()} />
);
export default Page;
