import { useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { Canvas, Circle, Group, LinearGradient, Mask, rotate } from "@shopify/react-native-skia"
import { StyleSheet } from "react-native";
import {  useEffect } from "react";

type Props = {
    theme: string | null | undefined;
}

const RADIUS = 70;

const Icon = ({theme}: Props) => {
    const gradientColor1 = useSharedValue('#FF4467');
    const gradientColor2 = useSharedValue('#FF8E0B');
    const cy   = useSharedValue(0);
    const mask = useSharedValue(0);

    const colors = useDerivedValue(() => {
        return [gradientColor1.value, gradientColor2.value]
    });

    useEffect(() => {
        if(theme === 'light'){
            cy.value   = withSpring(0);
            mask.value = withSpring(0)
            gradientColor1.value = withSpring('#FF4467');
            gradientColor2.value = withSpring('#FF8E0B');
        } else {
            cy.value   = withSpring(RADIUS / 2,{duration:2000});
            mask.value = withSpring(RADIUS,    {duration:2000});
            gradientColor1.value = withSpring('#8371FF');
            gradientColor2.value = withSpring('#86BFFF');
        }
    }, [gradientColor1, gradientColor2, theme]);

    return (
        <Canvas style={styles.container}>   
            <Mask mode="luminance" 
                mask= {
                    <Group>
                        <Circle cx={RADIUS} cy={RADIUS} r={RADIUS} color={"#FFF"}/>
                        <Circle cx={RADIUS} cy={cy} r={mask} color={"#000"}/>
                    </Group>
                }
            >            
                <Circle cx={RADIUS} cy={RADIUS} r={RADIUS}/>
                <LinearGradient origin={{x: RADIUS, y: RADIUS}} transform={[{rotate: -90}]} colors={colors} start={{x: 0, y: 0}} end={{x: RADIUS * 2, y: RADIUS * 2}}/>
            </Mask> 
        </Canvas>
    )
}
export default Icon

const styles = StyleSheet.create({
    container: {
        width:   RADIUS * 2,
        height:  RADIUS * 2,
        transform: [{rotate: '45deg'}]
    }
})