export type AppleDevice = {
    udid?: string;
    version?: string;
    isAvailable?: boolean;
    name?: string;
    icon?: string;
    isDevice?: boolean;
};

export type AndroidDevice = {
    udid: string;
    model?: string;
    product?: string;
    isPhone?: boolean;
    isTablet?: boolean;
    isWear?: boolean;
    isTV?: boolean;
    isMobile?: boolean;
    screenProps?: any;
    arch?: string;
    avdConfig?: any;
    isNotEligibleAndroid?: boolean;
    name: string;
    isDevice?: boolean;
    isActive: boolean;
};

// export type ScreenProps = {
//     width: 0;
//     height: 0;
//     density: 0;
// };

export type WebosDevice = {
    key?: string;
    name: string;
    value?: string;
    device: string;
    connection: string;
    profile: string;
    isDevice: boolean;
    active: boolean;
};

export type TizenDevice = {
    name: string;
    type: string;
    id: string;
    deviceType: string;
};

export type TizenSecurityConfig = {
    profileName: string;
    certPath: string;
    certPassword: string;
};
