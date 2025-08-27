import { CustomSelectionDot } from "@/components/CustomSelectionDot";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text } from "react-native";
import { GraphPoint, LineGraph } from "react-native-graph";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
    const backgroundThemeColor = useThemeColor({}, "background");

    function weightedRandom(mean: number, variance: number): number {
        const u1 = Math.random();
        const u2 = Math.random();

        // Box-Muller transform
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        // Scale by standard deviation (sqrt of variance) and shift by mean
        return z0 * Math.sqrt(variance) + mean;
    }

    function generateRandomGraphData(length: number): GraphPoint[] {
        return Array<number>(length)
            .fill(0)
            .map((_, index) => ({
                date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * index),
                value: weightedRandom(10, Math.pow(index + 1, 2)),
            }));
    }

    let randomData: GraphPoint[] = generateRandomGraphData(10);

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: backgroundThemeColor }]}>
            <Text>Hello, World</Text>
            <LineGraph
                points={randomData}
                color={Colors.primary}
                animated={true}
                enablePanGesture={true}
                panGestureDelay={0}
                onPointSelected={(p) => console.log(p)}
                SelectionDot={CustomSelectionDot}
                style={{ height: 300, width: "100%" }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});
