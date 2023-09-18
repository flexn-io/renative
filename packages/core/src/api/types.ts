export type AnalyticsApi = {
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};
