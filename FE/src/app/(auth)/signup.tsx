import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { Link, router } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import { registerAPI } from "@/utils/api"
import Toast from 'react-native-root-toast';
import { Formik } from "formik"
import { SignUpSchema } from "@/utils/validate.schema"


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        gap: 10,
    },

})

const SignUpPage = () => {
    const handleSignUp = async (name: string, email: string, password: string) => {
        try {
            const res = await registerAPI(email, password, name)
            if (res.data) {
                router.replace({
                    pathname: "/(auth)/verify",
                    params: { email: email, isLogin: 0 }
                })
            } else {
                const m = Array.isArray(res.message)
                    ? res.message[0]
                    : res.message
                Toast.show(m, {
                    duration: Toast.durations.SHORT,
                    textColor: "white",
                    backgroundColor: APP_COLOR.ORANGE,
                    opacity: 1,
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Check error: ", error.response?.data);
            } else {
                console.log("Check error: ", error);
            }
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Formik
                validationSchema={SignUpSchema}
                initialValues={{ name: '', email: '', password: '' }}
                onSubmit={values => handleSignUp(values.name, values.email, values.password)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View style={styles.container}>
                        <View>
                            <Text style={{
                                fontSize: 25,
                                fontWeight: 600,
                                marginVertical: 30
                            }}>Đăng ký tài khoản</Text>
                        </View>

                        <ShareInput
                            title="Họ tên"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            error={errors.name}
                        />

                        <ShareInput
                            title="Email"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                        />

                        <ShareInput
                            title="Password"
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                        />

                        <View style={{ marginVertical: 10 }}></View>
                        <ShareButton
                            tittle="Đăng Ký"
                            onPress={handleSubmit}
                            textStyle={{
                                textTransform: 'uppercase',
                                color: '#fff',
                                paddingVertical: 5
                            }}
                            btnStyle={{
                                backgroundColor: APP_COLOR.ORANGE,
                                justifyContent: 'center',
                                borderRadius: 30,
                                marginHorizontal: 50,
                                paddingVertical: 10,

                            }}
                            pressStyle={{ alignSelf: 'stretch' }}
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 10,
                            marginTop: 20,
                        }}>
                            <Text style={{
                                color: 'black',
                            }}>
                                Đã có tài khoản?
                            </Text>

                            <Link href={"/(auth)/login"}>
                                <Text style={{
                                    color: APP_COLOR.ORANGE,
                                }}>
                                    Đăng nhập
                                </Text>
                            </Link>
                        </View>

                        <SocialButton
                            title="Đăng kí với"
                        />
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    )
}

export default SignUpPage 