import { useState } from 'react';

interface Logger {
    logs: string[];
    logDebug: (message: string) => void;
}

export const useLogger = (): Logger => {
    const [logs, setLogs] = useState<string[]>([]);

    const logDebug = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    return { logs, logDebug };
};
