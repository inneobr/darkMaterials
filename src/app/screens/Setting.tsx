import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import BottomSheet, { BottomSheetMethods } from "@/components/BottomSheet";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

const Settings = () => {
    const colorScheme = useColorScheme();
    const insets= useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheetMethods>(null);
    const [themeSwitch, setThemeSwitch] = useState<string>("system");
    const [theme, setTheme] = useState<string | null | undefined>(colorScheme);

    useEffect(() => {
        if(themeSwitch === 'system'){
            setTheme(colorScheme);            
        }
    },[colorScheme, themeSwitch]);

    const backGoundColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor: theme === 'dark' ? withTiming('#000') : withTiming('#FFF')
        }
    })

    return (
        <Animated.View style={[styles.container, {paddingTop: insets.top}, backGoundColorAnimation]}>
            <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor={ theme === 'dark' ? '#000' : '#FFF' } /> 
            <Button bottomSheetRef={bottomSheetRef} theme={theme}/>
            <BottomSheet ref={bottomSheetRef} 
                setThemeSwitch={setThemeSwitch} 
                themeSwitch={themeSwitch}
                setTheme={setTheme}
                theme={theme}
            />
        </Animated.View>
    )
}
export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});