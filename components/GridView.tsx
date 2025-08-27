import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import {
    eachDayOfInterval,
    endOfMonth,
    format,
    parseISO,
    startOfMonth,
    startOfToday,
    subMonths,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Svg, { Rect } from "react-native-svg";

const numRows = 7;
const cellSize = 12;
const cellPadding = 2;
const cornerRadius = 2;

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

interface GridViewProps {
    habitId: string;
    createdAt: string;
    refreshTrigger: number;
    today: string;
    todayCompleted: boolean;
}

export default function GridView({
    habitId,
    createdAt,
    refreshTrigger,
    today,
    todayCompleted,
}: GridViewProps) {
    const colorScheme = useColorScheme();
    const [completions, setCompletions] = useState<Set<string>>(new Set());
    const scrollRef = useRef<ScrollView | null>(null);

    const svgHeight = numRows * (cellSize + cellPadding);

    const overallEnd = startOfToday();
    const overallStart = startOfMonth(subMonths(overallEnd, 5));

    const months: {
        key: string;
        label: string;
        weeks: (Date | null)[][];
    }[] = [];

    // iterate months from start month to end month
    const curMonth = new Date(overallStart);
    const endCursorMonth = endOfMonth(overallEnd);
    while (curMonth <= endCursorMonth) {
        const monthStart = startOfMonth(curMonth);
        const monthEnd = endOfMonth(curMonth) > overallEnd ? overallEnd : endOfMonth(curMonth);
        const monthDates = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // group into weeks (columns)
        const monthWeeks: (Date | null)[][] = [];
        let currentWeek: (Date | null)[] = [];
        for (let i = 0; i < monthDates.length; i++) {
            const date = monthDates[i];

            // pad first week
            if (i === 0) {
                for (let j = 0; j < date.getDay(); j++) {
                    currentWeek.push(null);
                }
            }

            currentWeek.push(date);

            const isEndOfWeek = date.getDay() === 6 || i === monthDates.length - 1;
            if (isEndOfWeek) {
                monthWeeks.push(currentWeek);
                currentWeek = [];
            }
        }

        months.push({
            key: `${curMonth.getFullYear()}-${curMonth.getMonth()}`,
            label: monthStart.toLocaleString("default", { month: "short" }),
            weeks: monthWeeks,
        });

        // move to next month
        curMonth.setMonth(curMonth.getMonth() + 1);
        curMonth.setDate(1);
    }

    // Fetch all task completions for box filling
    useEffect(() => {
        let mounted = true;
        const fetchCompletions = async () => {
            try {
                const start = format(overallStart, "yyyy-MM-dd");
                const end = format(overallEnd, "yyyy-MM-dd");

                const { data, error } = await supabase
                    .from("habit_completions")
                    .select("completed_date")
                    .eq("habit_id", habitId)
                    .gte("completed_date", start)
                    .lte("completed_date", end);

                if (!mounted) return;
                if (!error && data) {
                    const fetched = new Set((data as any[]).map((d) => d.completed_date));
                    setCompletions(fetched);
                }
            } catch (e) {
                console.warn("GridView fetch error", e);
            }
        };

        fetchCompletions();
        return () => {
            mounted = false;
        };
    }, [habitId, refreshTrigger]);

    const getCellColor = (date: Date): string => {
        const dateString = format(date, "yyyy-MM-dd");
        const taskCreatedDate = format(parseISO(createdAt), "yyyy-MM-dd");

        // Show blank if day before created date
        if (dateString < taskCreatedDate) {
            return colorScheme === "dark" ? "#2a2a2a" : "#f0f0f0";
        }

        // If date is after or same day as creation, show either primary or red for completion or failure
        if (completions.has(dateString)) {
            return Colors.primary;
        } else {
            return Colors.shared.gridFailed;
        }
    };

    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const labelColor = colorScheme === "dark" ? "#888" : "#666";

    return (
        <View style={styles.mainContainer}>
            <View style={{ flexDirection: "row" }}>
                <View style={[styles.dayLabelsContainer, { height: cellSize * 7, paddingTop: 15 }]}>
                    {daysOfWeek.map((day, index) => (
                        <Text key={index} style={[styles.dayLabel, { color: labelColor }]}>
                            {day}
                        </Text>
                    ))}
                </View>
                <ScrollView
                    horizontal
                    ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.monthsScroll}
                    onContentSizeChange={() => {
                        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 0);
                    }}
                >
                    {months.map((month) => {
                        const svgWidth = month.weeks.length * (cellSize + cellPadding);

                        return (
                            <View key={month.key} style={styles.monthContainer}>
                                <Text style={[styles.monthLabelInline, { color: labelColor }]}>
                                    {month.label}
                                </Text>

                                <View>
                                    <Svg width={svgWidth} height={svgHeight}>
                                        {month.weeks.map((week, col) =>
                                            week.map((date, row) => {
                                                const x = col * (cellSize + cellPadding);
                                                const y = row * (cellSize + cellPadding);
                                                return (
                                                    <Rect
                                                        key={
                                                            date
                                                                ? date.toISOString()
                                                                : `empty-${col}-${row}`
                                                        }
                                                        x={x}
                                                        y={y}
                                                        width={cellSize}
                                                        height={cellSize}
                                                        rx={cornerRadius}
                                                        ry={cornerRadius}
                                                        fill={
                                                            date
                                                                ? getCellColor(date)
                                                                : themeBackgroundColor
                                                        }
                                                    />
                                                );
                                            })
                                        )}
                                    </Svg>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
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
    monthsRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    monthContainer: {
        marginRight: 10,
        alignItems: "flex-start",
    },
    monthLabelInline: {
        fontSize: 10,
        marginBottom: 4,
        marginLeft: 2,
    },
    monthsScroll: {
        alignItems: "flex-start",
    },
});
