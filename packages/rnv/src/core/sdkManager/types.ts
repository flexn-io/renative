export type AppleDevice = {
    udid: string;
};

export type AndroidDevice = {
    udid: string;
    model: string;
    product: string;
    isPhone: boolean;
    isTablet: boolean;
    isWear: boolean;
    isTV: boolean;
    isMobile: boolean;
    screenProps: any;
    arch: string;
    avdConfig: any;
    isNotEligibleAndroid: boolean;
};
