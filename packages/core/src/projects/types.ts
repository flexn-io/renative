import { NpmDepKey } from '../configs/types';

export type ParseFontsCallback = (font: string, dir: string) => void;

export type AsyncCallback = () => Promise<void>;

export type DependencyMutation = {
    name: string;
    original?: {
        version: string;
    };
    updated: {
        version: string;
    };
    type: NpmDepKey;
    msg: string;
    source: string;
    targetPath?: string;
};
