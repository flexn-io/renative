import { FC, ReactNode, createContext } from 'react';

const MockContext = createContext<any>({});

type MockProviderProps = {
    children: ReactNode;
};

export const SafeAreaProvider: FC<MockProviderProps> = ({ children }) => {
    return <MockContext.Provider value={{}}>{children}</MockContext.Provider>;
};
