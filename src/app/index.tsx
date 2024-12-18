import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Settings from "@/app/screens/Setting"

export default function Index() {
    return(
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <Settings />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}