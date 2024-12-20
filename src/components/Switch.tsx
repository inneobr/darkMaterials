import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Appearance, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useEffect } from "react";
import { dark, light } from "@/unistyles/theme";

type Props = {
    setThemeSwitch: React.Dispatch<React.SetStateAction<string>>;
    themeSwitch: string;
    setTheme: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    theme: string | null | undefined;
};

const Switch = ({setThemeSwitch, themeSwitch, setTheme, theme }: Props) => {
    const colorScheme = Appearance.getColorScheme();
    const {width} = useWindowDimensions();
    const SWITCH_CONTAINER_WIDTH = width * 0.8;
    const SWITCH_WIDTH = width * 0.8 / 3;
    const translateX = useSharedValue(SWITCH_WIDTH * 0);

    const translateAnimation = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}]
        }
    });

    useEffect(() => {
        if(themeSwitch === 'system') {
            translateX.value = withSpring(SWITCH_WIDTH * 0);
        } else if(themeSwitch === 'light') {
            translateX.value = withSpring(SWITCH_WIDTH * 1);
        } else if(themeSwitch === 'dark') {
            translateX.value = withSpring(SWITCH_WIDTH * 2);
        }
    },[SWITCH_WIDTH, themeSwitch, translateX]);

    const backGoundColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming(dark.colors.background) : withTiming(light.colors.background)
        }
    });

    const slideColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming(light.colors.shape) : withTiming(dark.colors.shape)
        }
    });

    const textColorAnimation = useAnimatedStyle(() => {
        return {
            color: theme === 'dark' ? withTiming(dark.colors.text) : withTiming(light.colors.text)
        }
    });

    return (
        <Animated.View style={[styles.container, {width: SWITCH_CONTAINER_WIDTH}, backGoundColorAnimation]}>
            <Animated.View style={[styles.sliderContainer, {width: SWITCH_WIDTH}, translateAnimation]}>
                <Animated.View style={[styles.slide, {width: width * 0.7 / 3}, slideColorAnimation]}/>
            </Animated.View>
            <Pressable style={styles.button} onPress={() => {
                setThemeSwitch('system');
                if(colorScheme) {
                    setTheme(colorScheme)
                }
            }}>
                <Animated.Text style={[styles.textButton, textColorAnimation]}>System</Animated.Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => {
                setThemeSwitch('light');
                if(colorScheme) {
                    setTheme('light')
                }
            }}>
                <Animated.Text style={[styles.textButton, textColorAnimation]}>Light</Animated.Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => {
                setThemeSwitch('dark');
                if(colorScheme) {
                    setTheme('dark')
                }
            }}>
                <Animated.Text style={[styles.textButton, textColorAnimation]}>Dark</Animated.Text>
            </Pressable>
        </Animated.View>
    )
}
export default Switch

const styles = StyleSheet.create({
    container: {
        backgroundColor: dark.colors.shape,
        justifyContent: "space-evenly",
        flexDirection: "row",
        overflow: 'hidden',     
        borderRadius: 40,
        marginTop: 20,
    },    

    button: {
        alignItems : "center",
        padding: 20,
        flex: 1
    },

    textButton: {
        color: dark.colors.background,
        fontWeight: '500'
    },
    
    sliderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center"
    },

    slide: {
        borderRadius: 100,
        padding: 23,
    }
})