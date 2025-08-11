import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { Text } from "@react-navigation/elements";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import GridView from "./GridView";

const TASK_HEIGHT = 72;

export default function TaskItem({
    item,
    onDelete,
}: {
    item: Task;
    onDelete: (id: string) => void;
}) {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        checkCompletion();
    }, [item.id]);

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
                    console.log("handleCompletionToggle:", error);
                }
            } else {
                const { error } = await supabase
                    .from("habit_completions")
                    .delete()
                    .eq("habit_id", item.id)
                    .eq("completed_date", today);

                if (error) {
                    setIsChecked(false);
                    console.log("handleCompletionToggle:", error);
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

    return (
        <View style={[styles.mainContainer, { backgroundColor: themeBackgroundColor }]}>
            <TouchableWithoutFeedback
                onLongPress={() => console.log("press")}
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
                    <GridView />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderColor: "#333",
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
