import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { useCurrentApp } from "@/context/app.context";
import { registerSecureAPI, registerVulnerableAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from 'react-native-root-toast';

/**
 * Đây là màn hình Demo chính, thay thế cho Home cũ
 * Thực hiện yêu cầu của đề cương:
 * 1. Demo đăng ký với MD5 (vulnerable)
 * 2. Demo đăng ký với Bcrypt (secure)
 * 3. So sánh thời gian hash (lấy từ response của BE)
 */
const DemoPage = () => {
    const { appState } = useCurrentApp();

    // State cho form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // State loading
    const [loadingVulnerable, setLoadingVulnerable] = useState(false);
    const [loadingSecure, setLoadingSecure] = useState(false);

    /**
     * Hàm demo đăng ký Vulnerable (MD5)
     */
    const handleDemoVulnerable = async () => {
        if (!email || !password || !name) {
            Alert.alert("Lỗi", "Vui lòng nhập đủ Email, Mật khẩu, Tên");
            return;
        }
        setLoadingVulnerable(true);
        const startTime = Date.now();
        try {
            // Sử dụng email + timestamp để email luôn là duy nhất
            const uniqueEmail = `${email.split('@')[0] || 'test'}+${Date.now()}@${email.split('@')[1] || 'gmail.com'}`;

            const res = await registerVulnerableAPI(uniqueEmail, password, name);
            const endTime = Date.now();
            const apiTime = endTime - startTime;

            if (res.data) {
                Alert.alert(
                    "Demo MD5 Thành Công",
                    `${res.message}\n(Tổng thời gian API: ${apiTime} ms)`
                );
            } else {
                Alert.alert("Lỗi", res.message as string);
            }
        } catch (e: any) {
            Alert.alert("Lỗi", e.message);
        }
        setLoadingVulnerable(false);
    };

    /**
     * Hàm demo đăng ký Secure (Bcrypt)
     */
    const handleDemoSecure = async () => {
        if (!email || !password || !name) {
            Alert.alert("Lỗi", "Vui lòng nhập đủ Email, Mật khẩu, Tên");
            return;
        }
        setLoadingSecure(true);
        const startTime = Date.now();
        try {
            // Sử dụng email + timestamp để email luôn là duy nhất
            const uniqueEmail = `${email.split('@')[0] || 'test'}+${Date.now()}@${email.split('@')[1] || 'gmail.com'}`;

            const res = await registerSecureAPI(uniqueEmail, password, name);
            const endTime = Date.now();
            const apiTime = endTime - startTime;

            if (res.data) {
                Alert.alert(
                    "Demo Bcrypt Thành Công",
                    `${res.message}\n(Tổng thời gian API: ${apiTime} ms)`
                );
            } else {
                Alert.alert("Lỗi", res.message as string);
            }
        } catch (e: any) {
            Alert.alert("Lỗi", e.message);
        }
        setLoadingSecure(false);
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="handled" // Cho phép đóng keyboard khi nhấn ngoài
            >
                <Text style={styles.title}>Chào, {appState?.user.name}!</Text>
                <Text style={styles.subtitle}>Demo So Sánh Tốc Độ Hashing</Text>
                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>1. Mô Phỏng Đăng Ký</Text>
                <Text style={styles.description}>
                    Nhập thông tin để tạo user mới. Hệ thống sẽ đo thời gian cần thiết để hash mật khẩu ở backend và trả về kết quả.
                </Text>

                <ShareInput
                    title="Họ tên"
                    value={name}
                    onChangeText={setName}
                />
                <ShareInput
                    title="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="vd: test@gmail.com"
                />
                <ShareInput
                    title="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder="vd: 123456"
                />

                <Text style={styles.note}>
                    Lưu ý: Để đảm bảo email là duy nhất, hệ thống sẽ tự động thêm timestamp (vd: test+123456@gmail.com) trước khi gửi đi.
                </Text>

                <ShareButton
                    tittle="Test 1: Đăng ký Vulnerable (MD5)"
                    onPress={handleDemoVulnerable}
                    loading={loadingVulnerable}
                    btnStyle={{ backgroundColor: "#e74c3c", marginVertical: 10, alignSelf: 'stretch', justifyContent: 'center' }}
                    pressStyle={{ alignSelf: 'stretch' }}
                    textStyle={{ color: "white" }}
                />

                <ShareButton
                    tittle="Test 2: Đăng ký Secure (Bcrypt)"
                    onPress={handleDemoSecure}
                    loading={loadingSecure}
                    btnStyle={{ backgroundColor: "#2ecc71", alignSelf: 'stretch', justifyContent: 'center' }}
                    pressStyle={{ alignSelf: 'stretch' }}
                    textStyle={{ color: "white" }}
                />

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>2. Mô Phỏng Tấn Công</Text>
                <Text style={styles.description}>
                    Sau khi tạo tài khoản, bạn có thể dùng Postman để gọi API:
                    <Text style={{ fontWeight: 'bold' }}> POST /api/v1/auth/demo-crack</Text>
                </Text>
                <Text style={styles.description_small}>
                    <Text style={{ fontWeight: 'bold' }}>Body: </Text>
                    {`{ "email": "email_md5_cua_ban", "passwordGuess": "123456" }`}
                </Text>
                <Text style={styles.description}>
                    Bạn sẽ thấy mật khẩu MD5 bị crack ngay lập tức, trong khi Bcrypt sẽ bị từ chối.
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
        color: APP_COLOR.ORANGE,
        marginBottom: 15,
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
        marginBottom: 10,
    },
    description_small: {
        fontSize: 14,
        color: "#333",
        lineHeight: 22,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    note: {
        fontSize: 13,
        color: "#555",
        fontStyle: "italic",
        textAlign: "center",
        marginVertical: 10,
        paddingHorizontal: 15,
    }
});

export default DemoPage;