export type BabelApi = {
    cache: (value: boolean) => void;
};

export type BabelConfigPlugin = [
    string,
    {
        root?: Array<string | undefined>;
        alias?: Record<string, string | undefined>;
    }
];

export type BabelConfig = {
    retainLines?: boolean;
    plugins?: Array<BabelConfigPlugin>;
    presets?: Array<
        | string
        | [
              string,
              {
                  useTransformReactJSXExperimental?: boolean;
              }
          ]
    >;
};
