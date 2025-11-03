import { useCurrentApp } from "@/context/app.context";
import { getUrlBaseBackend } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Thêm import

const styles = StyleSheet.create({
    Pressable_custom: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    }
})

const AccountPage = () => {
    // Thêm setAppState và router
    const { appState, setAppState } = useCurrentApp();
    const baseImage = `${getUrlBaseBackend()}/images/avatar`;
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        await AsyncStorage.removeItem("access_token");
                        setAppState(null);
                        router.replace("/(auth)/welcome");
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                paddingTop: insets.top,
                paddingHorizontal: 20,
                paddingBottom: 20,
                backgroundColor: APP_COLOR.ORANGE,
                flexDirection: "row",
                gap: 20,
                alignItems: "center"
            }}>
                <Image
                    style={{ height: 60, width: 60 }}
                    source={{ uri: `${baseImage}/${appState?.user.avatar}` }}
                />
                <View>
                    <Text style={{ color: "white", fontSize: 20 }}>
                        {appState?.user.name}
                    </Text>
                </View>

            </View>

            <Pressable
                onPress={() => router.navigate("/(user)/account/info")}
                style={styles.Pressable_custom}>
                <View style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center"
                }}>
                    <Feather name="user-check" size={20} color="green" />
                    <Text>Cập nhật thông tin</Text>
                </View>

                <MaterialIcons name="navigate-next" size={24} color="grey" />
            </Pressable>

            {/* Xóa các Pressable không cần thiết (Thay đổi mật khẩu, Ngôn ngữ...) */}

            <View style={{
                flex: 1, justifyContent: "flex-end",
                gap: 10,
                paddingBottom: 15
            }}>
                <Pressable
                    // Thêm onPress
                    onPress={handleLogout}
                    style={({ pressed }) => ({
                        opacity: pressed === true ? 0.5 : 1,
                        padding: 10,
                        marginHorizontal: 10,
                        backgroundColor: APP_COLOR.ORANGE,
                        borderRadius: 3
                    })}>
                    <Text style={{
                        textAlign: "center",
                        color: "white"
                    }}>
                        Đăng Xuất
                    </Text>
                </Pressable>
                <Text style={{ textAlign: "center", color: APP_COLOR.GREY }}>
                </Text>
            </View>
        </View>
    )
}

export default AccountPage;