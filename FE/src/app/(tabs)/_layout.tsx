import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_COLOR } from "@/utils/constant";

const TabLayout = () => {

    const getIcons = (routeName: string, focused: boolean, size: number) => {
        if (routeName === "index") {
            return (
                <MaterialCommunityIcons // Đổi Icon
                    name="security"
                    size={size}
                    color={focused ? APP_COLOR.ORANGE : APP_COLOR.GREY}
                />)
        }

        if (routeName === "account") {
            return (
                focused ?
                    <MaterialCommunityIcons name="account" size={size} color={APP_COLOR.ORANGE} />
                    :
                    <MaterialCommunityIcons name="account-outline" size={size} color={APP_COLOR.GREY} />
            )
        }
        return (<></>)
    }

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    return getIcons(route.name, focused, size);
                },
                headerShown: false,
                tabBarLabelStyle: { paddingBottom: 3 },
                tabBarActiveTintColor: APP_COLOR.ORANGE,
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Demo Hash" // Đổi tên Tab
                }}
            />

            {/* Ẩn các tab không dùng đến */}
           
            <Tabs.Screen
                name="account"
                options={{
                    title: "Tôi"
                }}
            />
        </Tabs>
    )
}

export default TabLayout;