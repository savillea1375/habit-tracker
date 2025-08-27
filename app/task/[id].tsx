import CompletionEntry from "@/components/CompletionEntry";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Task as TaskType } from "@/types";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Task() {
    const { id, name } = useLocalSearchParams();

    const [task, setTask] = useState<TaskType | null>(null);
    const [completions, setCompletions] = useState<any[]>();
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();
    const backgroundTheme =
        colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
    const themeTextColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

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

        const fetchCompletions = async () => {
            const { data, error } = await supabase
                .from("habit_completions")
                .select("*")
                .eq("habit_id", id)
                .order("completed_date", { ascending: false });

            if (error) {
                console.error("Error fetching completion count:", error);
            } else {
                setCompletions(data ?? []);
            }
        };

        fetchTask();
        fetchCompletions();
    }, [id]);

    const createdAtString = task?.created_at
        ? format(parseISO(task.created_at), "MMMM d, yyyy")
        : undefined;

    return (
        <View
            style={[
                styles.mainContainer,
                {
                    backgroundColor: backgroundTheme,
                },
            ]}
        >
            <View style={styles.headerContainer}>
                <Text style={[styles.header, { color: themeTextColor }]}>{name}</Text>
            </View>
            <Text style={[styles.listHeader, { color: themeTextColor }]}>Completion List</Text>
            <FlatList
                data={completions}
                keyExtractor={(item) => String(item.id ?? item.completed_date)}
                renderItem={({ item }) => {
                    return <CompletionEntry completion={item} />;
                }}
                ListEmptyComponent={
                    <Text style={{ color: themeTextColor }}>No completions yet.</Text>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 12,
    },
    header: {
        fontSize: 38,
        fontWeight: "600",
        marginBottom: 12,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    taskName: {
        color: "black",
        fontSize: 42,
        fontWeight: "600",
        marginBottom: 12,
    },
    checkbox: {
        margin: 8,
        padding: 12,
    },
    listHeader: {
        fontSize: 28,
        marginBottom: 12,
    },
});
