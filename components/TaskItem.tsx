import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import ChevronRight from "./ChevronRight";

const TASK_HEIGHT = 72;

const TaskItem = ({ item, onDelete }: { item: Task; onDelete: (id: string) => void }) => {
    const router = useRouter();

    const handleDelete = async () => {
        const { error } = await supabase.from("habits").delete().eq("id", item.id);

        if (!error) onDelete(item.id);
    };

    const renderRightActions = () => {
        return (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            rightThreshold={TASK_HEIGHT / 2}
            overshootRight={false}
        >
            <View style={styles.taskRow}>
                <TouchableOpacity
                    style={styles.task}
                    onPress={() =>
                        router.push({
                            pathname: "/task/[id]",
                            params: { id: item.id, name: item.name },
                        })
                    }
                >
                    <View style={styles.taskTextWrapper}>
                        <Text style={styles.taskText}>{item.name}</Text>
                        <ChevronRight size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    task: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 12,
        marginBottom: 8,
        height: TASK_HEIGHT,
        justifyContent: "center",
    },
    taskText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    taskTextWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskRow: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        height: TASK_HEIGHT,
        marginBottom: 8,
        overflow: "hidden",
    },
    deleteButton: {
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        borderRadius: 12,
        height: TASK_HEIGHT,
    },
    deleteText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default TaskItem;
