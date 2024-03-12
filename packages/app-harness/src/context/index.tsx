import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

type LogMessage = string;

type LoggerContextType = {
    logs: LogMessage[];
    logDebug: (...msg: LogMessage[]) => void;
};
type LoggerProviderProps = {
    children: ReactNode;
};

const LoggerContext = createContext<LoggerContextType>({} as LoggerContextType);

export const LoggerProvider: FC<LoggerProviderProps> = ({ children }) => {
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const logDebug = (...msg: LogMessage[]) => {
        setLogs((prevLogs) => prevLogs.concat(msg));
        console.log(...msg);
    };

    return <LoggerContext.Provider value={{ logs, logDebug }}>{children}</LoggerContext.Provider>;
};

export const useLoggerContext = (): LoggerContextType => useContext(LoggerContext);
