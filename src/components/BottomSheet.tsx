import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useWindowDimensions } from "react-native";
import { dark, light } from "@/unistyles/theme"
import BackDrop from "./BackDrop";

import Switch from './Switch';
import Icon from './Icon';

type Props = {
    setThemeSwitch: React.Dispatch<React.SetStateAction<string>>;
    themeSwitch: string;
    setTheme: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    theme: string | null | undefined;
};

export interface BottomSheetMethods {
    open:  () => void;
    close: () => void;
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(({setThemeSwitch, themeSwitch, setTheme, theme}, ref) => {
    const { width } = useWindowDimensions();
    const insets= useSafeAreaInsets();
    const [ bottomSheetHeight, setBottomSheetHeight ] = useState(1000);

    const OPEN = 0;
    const CLOSE = bottomSheetHeight + insets.bottom;

    const translateY = useSharedValue(CLOSE);

    const open = useCallback(() => {
        translateY.value = withSpring(OPEN)
    }, [translateY]);

    const close = useCallback(() => {
        translateY.value = withSpring(CLOSE)
    }, [CLOSE, translateY]);

    useImperativeHandle(ref, () => ({
        open, close
    }), [open, close])

    const pan = Gesture.Pan()
        .onUpdate(event => {
            if(event.translationY < 0) {
                translateY.value = withSpring(OPEN, {
                    damping: 100,
                    stiffness: 400 
                })
            }else {
                translateY.value = withSpring(event.translationY, {
                    damping: 100,
                    stiffness: 400 
                })
            }
        })
        .onEnd(() => {
            if(translateY.value > 50) {
                translateY.value = withSpring(CLOSE, {
                    damping: 100,
                    stiffness: 400 
                })
            }else {
                translateY.value = withSpring(OPEN, {
                    damping: 100,
                    stiffness: 400 
                })
            }
        });

    const backGoundColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming(dark.colors.card) : withTiming(light.colors.card)
        }
    });

    const textColorAnimation = useAnimatedStyle(() => {
        return {
            color: theme === 'dark' ? withTiming(dark.colors.text) : withTiming(light.colors.text)
        }
    });

    const lineColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming(dark.colors.text) : withTiming(light.colors.text)
        }
    });

    const animationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: withTiming(translateY.value) }]
        };
    });

    return (
        <React.Fragment>
            <BackDrop translateY={translateY} openHeight={OPEN} closeHeight={CLOSE} close={close}/>  

            <GestureDetector gesture={pan}>     
                <Animated.View onLayout={({nativeEvent}) => {
                    const { height } = nativeEvent.layout;
                    if(height){
                        setBottomSheetHeight(height);
                        translateY.value = withSpring(height + insets.bottom);
                    }
                }} 
                    style={[styles.container, {width: width * 0.92, 
                    bottom: insets.bottom + 14}, animationStyle, backGoundColorAnimation]}
                > 
                    <Animated.View style={[styles.line, lineColorAnimation]} /> 
                    <Icon theme={theme}/>              
                    <Animated.Text style={[styles.textTitle, textColorAnimation]}>Theme settings</Animated.Text>
                    <Animated.Text style={[styles.text, textColorAnimation]}>configurações de cores e thema</Animated.Text>
                    <Animated.Text style={[styles.text, textColorAnimation]}>by sistemas inneo.org</Animated.Text>
                    <Switch setThemeSwitch={setThemeSwitch} themeSwitch={themeSwitch} setTheme={setTheme} theme={theme}/>
                </Animated.View>
            </GestureDetector> 
        </React.Fragment>
    )
})

export default BottomSheet

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        paddingHorizontal: 20,
        position: "absolute",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 40,
        borderRadius: 30,
        elevation: 16
    },
    
    line: {
        position: "absolute",
        borderRadius: 8,
        width: 40,
        height: 4,
        top: 8,
    },

    textTitle: {
        fontWeight: "bold",
        marginBottom: 14,
        marginTop: 40,
        fontSize: light.fonts.size.xl,
    },

    text: {
        fontSize: light.fonts.size.md,
        fontWeight: '500',
    }
});