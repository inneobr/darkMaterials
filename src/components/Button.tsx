import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { BottomSheetMethods } from "./BottomSheet";
import { dark, light } from "@/unistyles/theme";

type Props = {
    bottomSheetRef: React.RefObject<BottomSheetMethods>;
    theme: string | null | undefined;
};

const Button = ({bottomSheetRef, theme}: Props) => {
    const backGoundColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming(light.colors.shape) : withTiming(dark.colors.shape)
        }
    });

    const textColorAnimation = useAnimatedStyle(() => {
        return {
            color: theme === 'dark' ? withTiming(light.colors.background) : withTiming(dark.colors.background)
        }
    });

    return (
        <TouchableWithoutFeedback onPress={() => {bottomSheetRef.current?.open()}}>
            <Animated.View style={[styles.container, backGoundColorAnimation]}>                
                <Animated.Text style={[styles.text, textColorAnimation]}>Charge theme</Animated.Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}
export default Button

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
        borderRadius: 20,
        marginTop: 10,
        padding: 20,
    },

    text: {
        fontWeight: '500',
        fontSize: light.fonts.size.md,
    }
});