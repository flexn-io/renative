export type ParseFontsCallback = (font: string, dir: string) => void;
export type ConfigType = {
    dependencies?: Record<string,{platforms:Record<string,null>}>;
};