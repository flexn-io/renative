export type ChalkApi = {
    white: (v: any) => any;
    green: (v: any) => any;
    red: (v: any) => any;
    yellow: (v: any) => any;
    default: (v: any) => any;
    gray: (v: any) => any;
    grey: (v: any) => any;
    blue: (v: any) => any;
    cyan: (v: any) => any;
    magenta: (v: any) => any;
    rgb: () => (v: any) => any;
    bold: ChalkApi;
};
