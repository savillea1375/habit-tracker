import { eventBus } from "@/lib/eventBus";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { Text } from "@react-navigation/elements";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import GridView from "./GridView";

export default function TaskItem({
    item,
    onDelete,
}: {
    item: Task;
    onDelete: (id: string) => void;
}) {
    const [isChecked, setIsChecked] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        checkCompletion();
    }, [item.id]);

    // listen for changes inside [id]
    useEffect(() => {
        const off = eventBus.on("completionsChanged", (payload: any) => {
            if (!payload || payload.habitId !== item.id) return;
            // make GridView refetch completions
            setRefreshTrigger((r) => r + 1);
            // set today's checkbox
        });
        return off;
    });

    const checkCompletion = async () => {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("habit_completions")
            .select("id")
            .eq("habit_id", item.id)
            .eq("completed_date", today)
            .single();

        if (!error && data) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }
    };

    const handleCompletionToggle = async (checked: boolean) => {
        setIsChecked(checked);

        const today = new Date().toISOString().split("T")[0];

        try {
            // If task is being checked, insert into DB, else remove completion
            if (checked) {
                const { error } = await supabase.from("habit_completions").insert({
                    habit_id: item.id,
                    completed_date: today,
                    created_at: new Date().toISOString(),
                });

                if (error) {
                    setIsChecked(false);
                    console.error("handleCompletionToggle:", error);
                } else {
                    eventBus.emit("completionsChanged", {
                        habitId: item.id,
                        date: today,
                        present: true,
                    });
                    setRefreshTrigger((prev) => prev + 1);
                }
            } else {
                const { error } = await supabase
                    .from("habit_completions")
                    .delete()
                    .eq("habit_id", item.id)
                    .eq("completed_date", today);

                if (error) {
                    setIsChecked(false);
                    console.error("handleCompletionToggle:", error);
                } else {
                    eventBus.emit("completionsChanged", {
                        habitId: item.id,
                        date: today,
                        present: false,
                    });
                    setRefreshTrigger((prev) => prev + 1);
                }
            }
        } catch (error) {
            setIsChecked(!checked);
            console.log("Caught error:", error);
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("habits").delete().eq("id", item.id);

        if (!error) onDelete(item.id);
    };

    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeFontColor = useColorScheme() === "dark" ? "#fff" : "000";
    const themeBorderColor = useColorScheme() === "dark" ? "#333" : "#ddd";

    const todayString = new Date().toISOString().split("T")[0];

    const router = useRouter();

    return (
        <View
            style={[
                styles.mainContainer,
                { backgroundColor: themeBackgroundColor, borderColor: themeBorderColor },
            ]}
        >
            <TouchableWithoutFeedback
                onPress={() =>
                    router.push({
                        pathname: "/task/[id]",
                        params: { id: item.id, name: item.name },
                    })
                }
                onLongPress={() => console.log("show menu")}
                style={[styles.mainContainer, { backgroundColor: "#fff" }]}
            >
                <View>
                    <View style={[styles.taskRow]}>
                        <Text style={[styles.taskText, { color: themeFontColor }]}>
                            {item.name}
                        </Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={handleCompletionToggle}
                        />
                    </View>
                    <GridView
                        habitId={item.id}
                        createdAt={item.created_at}
                        refreshTrigger={refreshTrigger}
                        today={todayString}
                        todayCompleted={isChecked}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
    },
    taskText: {
        fontSize: 16,
    },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    checkbox: {
        padding: 12,
    },
});
