import CompletionEntry from "@/components/CompletionEntry";
import { useThemeColor } from "@/hooks/useThemeColor";
import { eventBus } from "@/lib/eventBus";
import { supabase } from "@/lib/supabase";
import { Task as TaskType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Task() {
    const { id, name } = useLocalSearchParams();

    const [task, setTask] = useState<TaskType | null>(null);
    const [completions, setCompletions] = useState<any[]>();
    const [loading, setLoading] = useState(false);

    const backgroundTheme = useThemeColor({}, "background");
    const themeTextColor = useThemeColor({}, "text");

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

        fetchTask();
    }, [id]);

    useEffect(() => {
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

        fetchCompletions();
    }, [completions]);

    const handleDelete = (completion: any) => {
        eventBus.emit("completionsChanged", {
            habitId: id,
            date: completion.completed_date,
            present: false,
        });
    };

    return (
        <SafeAreaView
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
                    return <CompletionEntry completion={item} onDelete={handleDelete} />;
                }}
                ListEmptyComponent={
                    <Text style={{ color: themeTextColor }}>No completions yet.</Text>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
