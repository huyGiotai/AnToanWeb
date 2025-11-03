import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import ShareButton from "components/button/share.button";
import { APP_COLOR } from "utils/constant";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import bg from '@/assets/auth/welcome-background.png';
import fbLogo from '@/assets/auth/facebook.png';
import ggLogo from '@/assets/auth/google.png';
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import TextBetweenLine from "@/components/button/text.between.line";
import { Link, Redirect, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccountAPI } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },

    welcomeText: {
        flex: 0.6,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 20,
    },

    welcomeBtn: {
        flex: 0.4,
        gap: 30,
    },

    heading: {
        fontSize: 40,
        fontWeight: "600",
    },

    body: {
        fontSize: 30,
        color: APP_COLOR.ORANGE,
        marginVertical: 10,
    },

    footer: {

    },

})

const WelcomePage = () => {
    return (
        <ImageBackground
            style={{ flex: 1 }}
            source={bg}
        >
            <LinearGradient
                style={{ flex: 1 }}
                colors={['transparent', '#191B2F']}
                locations={[0.2, 0.8]}

            >
                <View style={styles.container}>
                    <View style={styles.welcomeText}>
                        <Text style={styles.heading}>
                            Welcome to
                        </Text>
                        <Text style={styles.body}>
                            Dubai - Food
                        </Text>
                        <Text style={styles.footer}>
                            Nền tảng đặt món ăn hàng đầu tại Dubai
                        </Text>
                    </View>

                    <View style={styles.welcomeBtn}>
                        <TextBetweenLine
                            title="Đăng nhập với"
                            textColor="white"
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 30,
                        }}>
                            <ShareButton
                                tittle="facebook"
                                onPress={() => { alert("Đăng nhập với Facebook") }}
                                textStyle={{ textTransform: 'uppercase' }}
                                btnStyle={{
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    borderRadius: 30,

                                }}
                                icons={
                                    <Image source={fbLogo} />
                                }
                            />

                            <ShareButton
                                tittle="google"
                                onPress={() => { alert("Đăng nhập với Google") }}
                                textStyle={{ textTransform: 'uppercase' }}
                                btnStyle={{
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                    paddingHorizontal: 20,
                                }}
                                icons={
                                    <Image source={ggLogo} />
                                }
                            />
                        </View>

                        <View>
                            <ShareButton
                                tittle="Đăng nhập với email"
                                onPress={() => { router.navigate("/(auth)/login") }}
                                textStyle={{
                                    color: '#fff',
                                    paddingVertical: 5
                                }}
                                btnStyle={{
                                    backgroundColor: '#2c2c2c',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                    marginHorizontal: 50,
                                    paddingVertical: 10,
                                    borderColor: '#505050',
                                    borderWidth: 1,
                                }}
                                pressStyle={{ alignSelf: 'stretch' }}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 10,
                        }}>
                            <Text style={{
                                color: '#fff',
                            }}>
                                Chưa có tài khoản?
                            </Text>

                            <Link href={"/(auth)/signup"}>
                                <Text style={{
                                    textDecorationLine: 'underline',
                                    color: '#fff',
                                }}>
                                    Đăng ký
                                </Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

export default WelcomePage;