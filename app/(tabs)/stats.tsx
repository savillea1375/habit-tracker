import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
    const backgroundThemeColor = useThemeColor({}, "background");

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: backgroundThemeColor }]}>
            <Text>Hello, World</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});
