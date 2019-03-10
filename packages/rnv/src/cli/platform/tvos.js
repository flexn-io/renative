import ApplePlatform from './apple';
import { TVOS } from '../../common';

export default class TVOSPlatform extends ApplePlatform {
}

TVOSPlatform.platform = TVOS;
TVOSPlatform.defaultAppFolder = 'RNVAppTVOS';
