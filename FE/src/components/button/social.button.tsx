import { View, Text, Image, StyleSheet } from "react-native";
import TextBetweenLine from "./text.between.line";
import ShareButton from "./share.button";
import fbLogo from '@/assets/auth/facebook.png';
import ggLogo from '@/assets/auth/google.png';

const styles = StyleSheet.create({
    welcomeBtn: {
        flex: 1,
        gap: 30,
    },

})

interface IProps {
    title: string;
}

const SocialButton = (props: IProps) => {
    const { title } = props;
    return (
        <View style={styles.welcomeBtn}>
            <TextBetweenLine
                title = {title}
                textColor="black"
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
        </View>
    )
}

export default SocialButton;