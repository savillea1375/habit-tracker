import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const totalDays = 365;
const rows = 8;
const cols = Math.ceil(totalDays / rows);
const cellSize = 12;
const cellPadding = 2;
const cornerRadius = 2;

const GridView = () => {
    const rects = [];

    for (let i = 0; i < rows * cols; i++) {
        const col = Math.floor(i / rows);
        const row = i % rows;
        const x = col * (cellSize + cellPadding);
        const y = row * (cellSize + cellPadding);
        const isValidDay = i < totalDays;

        rects.push(
            <Rect
                key={i}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={cornerRadius}
                ry={cornerRadius}
                fill={isValidDay ? "#9be9a8" : "#e0e0e0"}
            />
        );
    }

    const svgWidth = cols * (cellSize + cellPadding);
    const svgHeight = rows * (cellSize + cellPadding);

    return (
        <View style={styles.mainContainer}>
            <Svg width={svgWidth} height={svgHeight}>
                {rects}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        padding: 16,
    },
});

export default GridView;
