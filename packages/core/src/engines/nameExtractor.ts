export const extractEngineName = (name: string) => `@rnv/${name.replace('@rnv/', '')}`;

export const extractEngineId = (name: string) => name.replace('@rnv/', '');
