import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
            backgroundColor: theme === 'dark' ? withTiming('#22273B') : withTiming('#F0F0F0')
        }
    });

    const textColorAnimation = useAnimatedStyle(() => {
        return {
            color: theme === 'dark' ? withTiming('#FFF') : withTiming('#000')
        }
    });

    const lineColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming('#FFF') : withTiming('#000')
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
                    <Animated.Text style={[styles.textTitle, textColorAnimation]}>Bottom sheet</Animated.Text>
                    <Animated.Text style={[styles.text, textColorAnimation]}>Pop or subtitle</Animated.Text>
                    <Animated.Text style={[styles.text, textColorAnimation]}>Customize</Animated.Text>
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
        borderRadius: 30
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
        fontSize: 22,
    },

    text: {
        fontSize: 16,
        fontWeight: '500',
    }
});