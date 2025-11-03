import LoadingOverlay from "@/components/loading/overlay";
import { APP_COLOR } from "@/utils/constant";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import OTPTextView from "react-native-otp-textinput";
import { useEffect, useRef, useState } from "react";
import { resendCodeAPI, verifyCodeAPI } from "@/utils/api";
import Toast from 'react-native-root-toast';
import { router, useLocalSearchParams } from "expo-router";

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,

    },

    heading: {
        fontSize: 25,
        fontWeight: "600",
        marginVertical: 20
    }
});



const VerifyPage = () => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const otpRef = useRef<OTPTextView>(null);
    const [code, setCode] = useState<string>("");
    const { email, isLogin } = useLocalSearchParams();

    const verifyCode = async () => {
        //cal API
        Keyboard.dismiss();
        setIsSubmit(true);
        const res = await verifyCodeAPI(email as string, code)
        setIsSubmit(false);
        //clear input
        if (res.data) {
            otpRef.current?.clear();
            Toast.show("Kích hoạt tài khoản thành công", {
                duration: Toast.durations.SHORT,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1,
            });
            if (isLogin === "0") {
                router.replace({
                    pathname: "/(auth)/login",
                    params: { email: email }
                });
            } else {
                router.replace("/(tabs)/");
            }


        } else {
            Toast.show(res.message as string, {
                duration: Toast.durations.SHORT,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1,
            });
        }
    }
    useEffect(() => {
        if (code && code.length === 6) {
            verifyCode();
        }

    }, [code])

    const handleResendCode = async () => {
        otpRef.current?.clear();
        //callAPI
        const res = await resendCodeAPI(email as string);
        const m = res.data ? "Resend code thành công" : res.message;
        Toast.show(m as string, {
            duration: Toast.durations.SHORT,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
        });

    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}>Xác thực tài khoản</Text>
                <Text style={{ marginVertical: 10 }}>Vui lòng nhập mã xác thực đã gửi đến email của bạn</Text>
                <View style={{ marginVertical: 20 }}>
                    <OTPTextView
                        ref={otpRef}
                        handleTextChange={setCode}
                        autoFocuse
                        inputCount={6}
                        inputCellLength={1}
                        tintColor={APP_COLOR.ORANGE}
                        textInputStyle={{
                            borderWidth: 1,
                            borderColor: APP_COLOR.GREY,
                            borderBottomWidth: 1,
                            borderRadius: 5,
                            // @ts-ignore:next-line
                            color: APP_COLOR.ORANGE,

                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Text>Không nhận được mã xác nhận, </Text>
                    <Text
                        onPress={handleResendCode}
                        style={{
                            textDecorationLine: 'underline',
                            color: APP_COLOR.ORANGE
                        }}
                    >
                        gửi lại
                    </Text>
                </View>
            </View>

            {isSubmit && <LoadingOverlay />}
        </>
    )
}
export default VerifyPage;