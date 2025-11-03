import AppProvider from "context/app.context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { View, Text, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
                <View style={{
                    backgroundColor: "#333", padding: 10,
                    borderRadius: 3, gap: 10
                }}>
                    <Text style={{ color: "red", fontSize: 20 }}>
                        Something went wrong
                    </Text>
                    <Text style={{ color: "#fff" }}>{error.message}</Text>
                </View>
                <Button title="Try Again ?" onPress={retry} />
            </View>
        </SafeAreaView>
    )
}

const RootLayout = () => {
    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
        },
    }

    return (
        // Sửa: Thêm style={{ flex: 1 }} cho GestureHandlerRootView
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RootSiblingParent>
                <AppProvider>
                    <ThemeProvider value={navTheme}>
                        <Stack>
                            <Stack.Screen
                                name="index"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/signup"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/verify"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/login"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(auth)/welcome"
                                options={{ headerShown: false }}
                            />

                            {/* Xóa route (user)/product/[id] */}

                            <Stack.Screen
                                name="(user)/account/info"
                                options={{ headerTitle: "Cập nhật thông tin" }}
                            />
                        </Stack>
                    </ThemeProvider>
                </AppProvider>
            </RootSiblingParent>
        </GestureHandlerRootView>
    )

};
export default RootLayout;