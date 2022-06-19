import React from 'react';
import Btn from './index.web';
import { withFocusable } from '@noriginmedia/react-spatial-navigation';

const Button = (props: any) => (<Btn {...props} />)

export default withFocusable()(Button);
