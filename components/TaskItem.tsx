import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { Text } from "@react-navigation/elements";
import Checkbox from "expo-checkbox";
import { useState } from "react";
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

    const handleDelete = async () => {
        const { error } = await supabase.from("habits").delete().eq("id", item.id);

        if (!error) onDelete(item.id);
    };

    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeFontColor = useColorScheme() === "dark" ? "#fff" : "000";

    return (
        <View style={[styles.mainContainer, { backgroundColor: "#000" }]}>
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
                            onValueChange={setIsChecked}
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
        paddingHorizontal: 18,
        paddingVertical: 12,
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
