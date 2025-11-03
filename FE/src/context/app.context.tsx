import { createContext, useContext, useState } from 'react';

interface AppContextType {
    theme: string;
    setTheme: (v: string) => void;
    appState: IUserLogin | null;
    setAppState: (v: any) => void;
    // Xóa cart và setCart
}

const AppContext = createContext<AppContextType | null>(null);

interface IProps {
    children: React.ReactNode;
}

const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<string>("");
    const [appState, setAppState] = useState<IUserLogin | null>(null);
    // Xóa state của cart

    return (
        <AppContext.Provider value={{
            theme, setTheme, appState,
            setAppState
            // Xóa cart và setCart
        }}>
            {props.children}

        </AppContext.Provider>
    )
}

export const useCurrentApp = () => {
    const currentTheme = useContext(AppContext);

    if (!currentTheme) {
        throw new Error(
            "useCurrentUser has to be used within <currentTheme.Provider>"
        );
    }

    return currentTheme;
};

export default AppProvider