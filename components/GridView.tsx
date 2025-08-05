import { eachDayOfInterval, startOfToday, startOfWeek, subMonths } from "date-fns";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const numRows = 7;
const cellSize = 12;
const cellPadding = 2;
const cornerRadius = 2;
const greenHex = "#9be9a8";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const getPastSixMonthsDates = () => {
    const endDate = startOfToday();
    const startDate = startOfWeek(subMonths(endDate, 5), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
};

export default function GridView() {
    const colorScheme = useColorScheme();

    const dates = getPastSixMonthsDates();
    const weeks: Date[][] = [];

    let currentWeek: Date[] = [];
    for (let i = 0; i < dates.length; i++) {
        currentWeek.push(dates[i]);
        const isEndOfWeek = dates[i].getDay() === 6 || i === dates.length - 1;

        if (isEndOfWeek) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    const monthLabels: { name: string; x: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, col) => {
        const firstDay = week[0];
        const currentMonth = firstDay.getMonth();

        if (currentMonth !== lastMonth) {
            const monthName = firstDay.toLocaleString("default", { month: "short" });
            const x = col * (cellSize + cellPadding);
            monthLabels.push({ name: monthName, x });
            lastMonth = currentMonth;
        }
    });

    const svgWidth = weeks.length * (cellSize + cellPadding);
    const svgHeight = numRows * (cellSize + cellPadding);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.monthLabelsContainer}>
                {monthLabels.map((label, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.monthLabel,
                            {
                                left: label.x,
                                position: "absolute",
                                width: cellSize * 3,
                                textAlign: "left",
                            },
                        ]}
                    >
                        {label.name}
                    </Text>
                ))}
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.dayLabelsContainer}>
                    {daysOfWeek.map((day, index) => (
                        <Text key={index} style={styles.dayLabel}>
                            {day}
                        </Text>
                    ))}
                </View>
                <View style={{ width: svgWidth, height: svgHeight }}>
                    <Svg>
                        {weeks.map((week, col) =>
                            week.map((date, row) => {
                                const x = col * (cellSize + cellPadding);
                                const y = row * (cellSize + cellPadding);
                                return (
                                    <Rect
                                        key={date.toISOString()}
                                        x={x}
                                        y={y}
                                        width={cellSize}
                                        height={cellSize}
                                        rx={cornerRadius}
                                        ry={cornerRadius}
                                        fill={"#e0e0e0"}
                                    />
                                );
                            })
                        )}
                    </Svg>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
    },
    dayLabelsContainer: {
        justifyContent: "space-between",
    },
    dayLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginRight: 4,
        lineHeight: cellSize + cellPadding,
    },
    monthLabelsContainer: {
        height: 20,
        marginLeft: 24,
        position: "relative",
    },
    monthLabel: {
        fontSize: 10,
        color: "#666",
    },
});
