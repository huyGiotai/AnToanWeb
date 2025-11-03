import { View, Text, StyleSheet, Pressable, StyleProp, TextStyle, ActivityIndicator } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { ReactNode } from "react";
import { APP_COLOR } from "utils/constant";

const styles = StyleSheet.create({
    btnContainer: {

        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: APP_COLOR.ORANGE,

    },

    text: {
        textTransform: 'uppercase',

    }
})

interface IProps {
    tittle: string;
    onPress: () => void;

    textStyle?: StyleProp<TextStyle>;
    pressStyle?: StyleProp<TextStyle>;
    btnStyle?: StyleProp<TextStyle>;
    icons?: ReactNode,
    loading?: boolean;
    placeholder?: string; // <--- THÊM DÒNG NÀY
}


const ShareButton = (props: IProps) => {
    const { tittle, onPress, textStyle,
        pressStyle, btnStyle,
        icons, loading = false, 
    } = props;
    return (
        <Pressable
            disabled={loading}
            style={({ pressed }) => ([{
                alignSelf: 'flex-start',
                opacity: pressed === true || loading ? 0.5 : 1
            }, pressStyle])}
            onPress={onPress}
        >
            <View style={[styles.btnContainer, btnStyle]}>
                {loading && <ActivityIndicator 
                    color={"black"}
                />}

                {icons}

                <Text
                    style={textStyle}>
                    {tittle}
                </Text>
            </View>
        </Pressable>
    )
}

export default ShareButton;