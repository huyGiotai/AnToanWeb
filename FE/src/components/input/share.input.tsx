import { APP_COLOR } from "@/utils/constant";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, KeyboardTypeOptions } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const styles = StyleSheet.create({
    inputGroup: {
        padding: 5,
        gap: 10,
    },
    text: {
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },

    eye: {
        position: 'absolute',
        right: 10,
        top: 18,
    }
})

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    value: any;
    setValue?: (v: any) => void;
    onChangeText?: any;
    onBlur?: any;
    error?: any;
    placeholder?: string;
}

const ShareInput = (props: IProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const { title, keyboardType, secureTextEntry = false,
        value, setValue, onChangeText, onBlur,
        error, placeholder
    } = props;

    return (
        <View style={styles.inputGroup}>
            {title && <Text style={styles.text}>
                {title}
            </Text>}
            <View>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        if (onBlur)
                            onBlur(e);
                        setIsFocused(false);
                    }}
                    keyboardType={keyboardType}
                    style={[
                        styles.input,
                        { borderColor: isFocused ? APP_COLOR.ORANGE : APP_COLOR.GREY }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword}

                />
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                {secureTextEntry &&
                    <FontAwesome5
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"}
                        size={15}
                        color="black"
                        onPress={() => setIsShowPassword(!isShowPassword)}
                    />
                }
            </View>
        </View>
    )
}

export default ShareInput;