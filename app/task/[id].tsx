import { supabase } from "@/lib/supabase";
import { Task as TaskType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Task = () => {
    const { id } = useLocalSearchParams();

    const [task, setTask] = useState<TaskType | null>(null);
    const [loading, setLoading] = useState(false);

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

    if (!task) {
        return (
            <View>
                <Text>Could not load task</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.taskName}>{task?.name}</Text>
            <Text style={styles.taskId}>{id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 100,
    },
    taskName: {
        color: "black",
        fontSize: 42,
        fontWeight: "600",
    },
    taskId: {
        color: "black",
    },
});

export default Task;
