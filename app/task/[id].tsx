import GridView from "@/components/GridView";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Task as TaskType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const Task = () => {
    const { id, name } = useLocalSearchParams();

    const [task, setTask] = useState<TaskType | null>(null);
    const [loading, setLoading] = useState(false);

    const colorScheme = useColorScheme();

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

    return (
        <View
            style={[
                styles.mainContainer,
                {
                    backgroundColor:
                        colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
                },
            ]}
        >
            <Text
                style={[
                    styles.taskName,
                    {
                        color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                    },
                ]}
            >
                {name}
            </Text>
            <GridView />
        </View>
    );
};

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

export default Task;
