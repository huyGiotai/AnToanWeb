import { View, Text, StyleSheet, Pressable } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';

const styles = StyleSheet.create({
    btnContainer: {
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#ccc',

    },

    text: {
        textTransform: 'uppercase',
    }
})

interface IProps {
    tittle: string;
    onPress: () => void;
}

const MineButton = (props: IProps) => {
    const { tittle, onPress } = props;
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                alignSelf: 'flex-start',
                opacity: pressed ? 0.5 : 1
            })}
        >
            <View style={styles.btnContainer}>
                <Entypo
                    name="circle-with-plus"
                    size={30}
                    color="black" />
                <Text
                    style={styles.text}>
                    {tittle}
                </Text>
            </View>
        </Pressable>
    )
}

export default MineButton;