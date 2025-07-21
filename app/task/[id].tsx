import GridView from "@/components/GridView";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Task as TaskType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function Task() {
    const { id, name } = useLocalSearchParams();

    const [task, setTask] = useState<TaskType | null>(null);
    const [completionCount, setCompletionCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();
    const backgroundTheme =
        colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
    const textTheme = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

    useEffect(() => {
        if (!id) return;

        const fetchTask = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("habits").select("*").eq("id", id).single();

            if (error) {
                console.error("Error fetching task:", error);
            } else {
                setTask(data);
            }
            setLoading(false);
        };

        const fetchCompletionCount = async () => {
            const { count, error } = await supabase
                .from("habit_completions")
                .select("*", { count: "exact", head: true })
                .eq("habit_id", id);

            if (error) {
                console.error("Error fetching completion count:", error);
            } else {
                setCompletionCount(count ?? 0);
            }
        };

        fetchTask();
        fetchCompletionCount();
    }, [id]);

    return (
        <View
            style={[
                styles.mainContainer,
                {
                    backgroundColor: backgroundTheme,
                },
            ]}
        >
            <Text
                style={[
                    styles.taskName,
                    {
                        color: textTheme,
                    },
                ]}
            >
                {name}
            </Text>
            <Text style={{ color: textTheme }}>Completed: {completionCount}</Text>
            <Text style={{ color: textTheme }}>Missed: {}</Text>
            <GridView />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 12,
    },
    taskName: {
        color: "black",
        fontSize: 42,
        fontWeight: "600",
        marginBottom: 12,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
});
